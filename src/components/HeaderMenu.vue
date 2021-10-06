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
                <li class="menu-item  has-sub">
                    <a href="#" class='menu-link'><i class="fa fa-gears"></i><span>Support</span></a>
                    <div class="submenu ">
                        <div class="submenu-group-wrapper">
                            <ul class="submenu-group">
                                <li class="submenu-item  ">
                                    <router-link to="/" class='submenu-link'>submenu 1</router-link>
                                </li>
                                <li class="submenu-item  ">
                                    <router-link to="/" class='submenu-link'>submenu 2</router-link>
                                </li>
                                <li class="submenu-item  ">
                                    <router-link to="/" class='submenu-link'>submenu 3</router-link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </nav>
</template>
