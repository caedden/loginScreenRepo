import { useState } from "react";
import { FiGrid, FiHome, FiPackage, FiSettings, FiTag, FiUser, FiLogOut, FiArchive } from "react-icons/fi";
import { Dashboard } from "./dashboard/Dashboard";
import { Usuarios } from "./usuarios/Usuarios";
import { Produtos } from "./produtos/Produtos";
import { Cupons } from "./cupons/Cupons";
import { Mesas } from "./mesas/Mesas";
import { authService } from "../services/authService";
import { Estoque } from "./Stock/stock";
import TokenInfo from '../services/tokenInfo';
import WelcomeScreen from '../pages/WelcomePage';

export function SideBar() {
    const [activeComponent, setActiveComponent] = useState("Dashboard");

    const handleLogout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }
    };

    const renderComponent = () => {
        switch (activeComponent) {
            case "WelcomeScreen":
                return <WelcomeScreen />;
            case "TokenInfo":
                return <TokenInfo />;
            default:
                return <WelcomeScreen />;
        }
    };

    const getIconClass = (component) =>
        activeComponent === component
            ? "bg-red-500 text-white p-2 rounded-md"
            : "text-red-500 hover:bg-gray-300 p-2 rounded-md";

    return (
        <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar fixa à esquerda */}
            <div className="bg-gray-200 w-24 flex flex-col justify-between items-center py-6">
                <div className="space-y-6">
                    <FiTag size={60} className={`cursor-pointer ${getIconClass("WelcomeScreen")}`} onClick={() => setActiveComponent("WelcomeScreen")} />
                    <FiTag size={60} className={`cursor-pointer ${getIconClass("TokenInfo")}`} onClick={() => setActiveComponent("TokenInfo")} />

                    {/* <FiHome size={60} className={`cursor-pointer ${getIconClass("Dashboard")}`} onClick={() => setActiveComponent("Dashboard")} />
                    <FiUser size={60} className={`cursor-pointer ${getIconClass("Usuarios")}`} onClick={() => setActiveComponent("Usuarios")} />
                    <FiPackage size={60} className={`cursor-pointer ${getIconClass("Produtos")}`} onClick={() => setActiveComponent("Produtos")} />
                    <FiTag size={60} className={`cursor-pointer ${getIconClass("Cupons")}`} onClick={() => setActiveComponent("Cupons")} />
                    <FiGrid size={60} className={`cursor-pointer ${getIconClass("Mesas")}`} onClick={() => setActiveComponent("Mesas")} />
                    <FiArchive
                        size={60}
                        className={`mx-auto cursor-pointer ${getIconClass("Estoque")}`}
                        onClick={() => setActiveComponent("Estoque")}
                    /> */}

                </div>
                <div className="space-y-6">
                    <FiSettings size={30} className="text-red-500" />
                    <FiLogOut
                        size={30}
                        className="text-red-500 cursor-pointer hover:bg-gray-300 p-2 rounded-md"
                        onClick={handleLogout}
                    />
                </div>
            </div>

            {/* Conteúdo renderizado ao lado da sidebar */}
            <div className="flex-1 overflow-y-auto bg-white">
                {renderComponent()}
            </div>
        </div>
    );
}

