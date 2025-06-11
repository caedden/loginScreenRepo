import { FiFilter, FiList, FiSearch } from "react-icons/fi";

export function Cupons(){
    return(
        <div className="m-7">
                    <div>
                        <h1 className="text-red-500 font-black text-5xl mt-4">CUPONS</h1>
                        <h3 className="font-bold">Crie e gerencie os dados dos cupons.</h3>
                        <hr className="border-y-2 w-full mt-2 border-gray-200"/>
                    </div>
                    <div className="flex mt-4 ml-10">
                        <div className="bg-gray-200 w-4/5 p-1 rounded-2xl">
                            <FiSearch size={25} className="text-red-500 ml-2"/>
                        </div>
                        <div>
                            <FiFilter size={25} className="text-red-500 mt-1 ml-2"/>
                        </div>
                        <div>
                            <h1 className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold ml-2">+ADICIONAR</h1>
                        </div>
                    </div>
        
                    {/* - Validar como trazer os dados dos cupons;
                        - Validar como serão apresentados os dados
                        - Validar campo de criação de cupons;
                        - Validar sobre números das páginas no final da tela */}
        
                    <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl ">
                        <div className="flex justify-evenly relative font-bold text-base text-gray-600">
                            <div>
                                <h3>Nome</h3>
                            </div>
                            <div>
                                <h3>ID Cupom</h3>
                            </div>
                            <div>
                                <h3>Desconto (R$/%)</h3>
                            </div>
                            <div>
                                <h3>Data Início</h3>
                            </div>
                            <div>
                                <h3>Data Final</h3>
                            </div>
                            <div>
                                <h3>Status</h3>
                            </div>
                        </div>
                        
                    </div>
                    
                </div>
    )
}