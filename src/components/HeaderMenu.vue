<template>
    <nav class="main-navbar">
        <div class="container">
            <ul>
                <li class="menu-item  ">
                    <router-link to="/" class='menu-link'><i class="fa fa-home"></i><span>Home</span></router-link>
                </li>
                <li class="menu-item  ">
                    <router-link to="/create" class='menu-link'><i class="fa fa-pencil"></i><span>CreateXml</span></router-link>
                </li>
                <li class="menu-item  ">
                    <router-link to="/sign" class='menu-link'><i class="fa fa-file-text-o"></i><span>SignXml</span></router-link>
                </li>
                <li class="menu-item  ">
                    <router-link to="/queue" class='menu-link'><i class="fa fa-file-text-o"></i><span>QueueXml</span></router-link>
                </li>
                <li class="menu-item  ">
                    <router-link to="/files" class='menu-link'><i class="fa fa-file"></i><span>SignFile</span></router-link>
                </li>
                <li class="menu-item  ">
                    <router-link to="/string" class='menu-link'><i class="fa fa-file-text-o"></i><span>SignString</span></router-link>
                </li>
            </ul>
        </div>
    </nav>
</template>
