import { FiFilter, FiSearch } from "react-icons/fi";

export function Mesas(){
    return(
        <div>
            <div className="m-7">
                <div>
                    <h1 className="text-red-500 font-black text-5xl mt-4">MESAS</h1>
                    <h3 className="font-bold">Crie e gerencie as mesas de seu estabelecimento.</h3>
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

                {/* - Validar como trazer as mesas;
                - Validar como serão apresentados os produtos
                - Validar campo de criação de mesas;
                - Validar sobre números das páginas no final da tela */}

                <div className="bg-gray-200 h-auto mt-4 p-8 rounded-2xl ">

                </div>
            </div>
        </div>
    )
}