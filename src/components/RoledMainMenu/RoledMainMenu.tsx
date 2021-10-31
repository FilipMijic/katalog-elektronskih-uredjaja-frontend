import React from 'react';
import { MainMenuItem, MainMenu } from '../MainMenu/MainMenu';

interface RoledMainMenuProperties {
    role: 'Guest' | 'Admin';
}

export default class RoledMainMenu extends React.Component <RoledMainMenuProperties> {
    render() {
        let items: MainMenuItem[] = [];

        switch (this.props.role) {
            case 'Guest': items = this.getGuestMenuItems(); break;
            case 'Admin': items = this.getAdministratorMenuItems(); break;
        }

        return <MainMenu items={items}></MainMenu>
    }

    getGuestMenuItems(): MainMenuItem[] {
        return [ 
            new MainMenuItem("Home", "/"),
            new MainMenuItem("Contact", "/contact"),
            new MainMenuItem("Login", "/auth/login"),];
    }

    getAdministratorMenuItems(): MainMenuItem[]{
        return [
            new MainMenuItem("Dashboard", "/administrator/dashboard"),
            new MainMenuItem("Log out", "/administrator/logout"),
        ];
    }
}