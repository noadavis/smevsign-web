export default class CryptoHelper {
    
    constructor() {
        this.crypto = window.cadesplugin;
    }

    // получаем пользовательские, не просроченные, подписи
    // include: '34.10-2012' для поиска только ГОСТ 2012
    async getUserCertificates(include) {
        const store = await this.crypto.CreateObjectAsync('CAdESCOM.Store');
        store.Open(
            this.crypto.CAPICOM_CURRENT_USER_STORE,
            this.crypto.CAPICOM_MY_STORE,
            this.crypto.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
        );
        let certs = await store.Certificates;
        certs = await certs.Find(this.crypto.CAPICOM_CERTIFICATE_FIND_TIME_VALID);
        const certificates = [];
        for (let i = 1; i <= await certs.Count; i += 1) {
            const cert = await certs.Item(i);
            const algorithmName = await this.getCertificateAlgorithm(cert);
            if (algorithmName.includes(include)) {
                certificates.push(await this.getCertificateInfo(cert, algorithmName));
            }
        }
        await store.Close();
        return certificates;
	}
    
    // получаем пользовательскую подпись по sha1 отпечатку
    async getUserCertificate(thumbprint) {
        const store = await this.crypto.CreateObjectAsync('CAdESCOM.Store');
        store.Open(
            this.crypto.CAPICOM_CURRENT_USER_STORE,
            this.crypto.CAPICOM_MY_STORE,
            this.crypto.CAPICOM_STORE_OPEN_MAXIMUM_ALLOWED
        );
        let certs = await store.Certificates;
        certs = await certs.Find(this.crypto.CAPICOM_CERTIFICATE_FIND_SHA1_HASH, thumbprint);
        const certsCount = await certs.Count;
        await store.Close();
        if (certsCount === 0) {
            return undefined;
        }
        return certs.Item(1);
	}

    // подписываем digest от нормализованного узла <SignedInfo>
    async signSignedInfoDigest(thumbprint, algorithm, digest) {
        const cert = await this.getUserCertificate(thumbprint);
        // экспортируем открытый ключ, он понадобится для сборки узла <Signature>
        const publicKey = await cert.Export(0);
        const oHashedData = await this.crypto.CreateObjectAsync('CAdESCOM.HashedData');
        if (algorithm.includes('256')) {
            await oHashedData.propset_Algorithm(this.crypto.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_256);
        } else if (algorithm.includes('512')) {
            await oHashedData.propset_Algorithm(this.crypto.CADESCOM_HASH_ALGORITHM_CP_GOST_3411_2012_512);
        }
        await oHashedData.SetHashValue(digest);
        const oRawSignature = await this.crypto.CreateObjectAsync('CAdESCOM.RawSignature');
        try {
            return {
                'hex': await oRawSignature.SignHash(oHashedData, cert),
                'cert' : publicKey
            }
        } catch (err) {
            console.log("Failed to create signature. Error: " + this.crypto.getLastError(err));
        }
        return undefined;
    }





    async getCertificateAlgorithm(certificate) {
        const publicKey = await certificate.PublicKey();
        const publicKeyAlgorithm = await publicKey.Algorithm;
        return await publicKeyAlgorithm.FriendlyName;
	}

    async getCertificateInfo(certificate, algorithmName) {
        return {
            subject: await certificate.SubjectName,
            thumbprint: await certificate.Thumbprint,
            validTo: await certificate.ValidToDate,
            algorithm: algorithmName
        }
	}

}
