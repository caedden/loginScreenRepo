import { useEffect, useState } from "react";
import { FiSearch, FiXCircle } from "react-icons/fi";

export function Usuarios() {
    const [showForm, setShowForm] = useState(false);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [telefone, setTelefone] = useState("");
    const [tipo, setTipo] = useState("cliente");
    const [status, setStatus] = useState("ativo");

    const [usuarios, setUsuarios] = useState([]);
    const [busca, setBusca] = useState("");
    const [filtroTipo, setFiltroTipo] = useState("todos");
    const [filtroStatus, setFiltroStatus] = useState("todos");

    // Paginação
    const [paginaAtual, setPaginaAtual] = useState(1);
    const itensPorPagina = 5;

    const toggleForm = () => setShowForm(!showForm);

    const fetchUsuarios = async () => {
        try {
            const res = await fetch("http://localhost:3000/api/clientes");
            if (res.ok) {
                const responseData = await res.json();
                setUsuarios(responseData.data);
            } else {
                console.error("Erro ao buscar usuários.");
            }
        } catch (err) {
            console.error("Erro na requisição:", err);
        }
    };

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const handleSubmit = async () => {
        if (!nome || !email || !telefone || !tipo || !status) {
            alert("Preencha todos os campos.");
            return;
        }

        const novoUsuario = {
            name: nome,
            email,
            phone: telefone,
            tipo,
            status: status === "ativo",
        };

        try {
            await fetch("http://localhost:3000/api/clientes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(novoUsuario),
            });

            alert("Usuário cadastrado com sucesso!");
            limparFormulario();
            toggleForm();
            fetchUsuarios();
        } catch (err) {
            console.error("Erro ao cadastrar:", err);
            alert("Erro ao cadastrar usuário.");
        }
    };

    const limparFormulario = () => {
        setNome("");
        setEmail("");
        setTelefone("");
        setTipo("cliente");
        setStatus("ativo");
    };

    // Filtro
    const usuariosFiltrados = usuarios.filter((usuario) =>
        usuario.name.toLowerCase().includes(busca.toLowerCase()) &&
        (filtroTipo === "todos" || usuario.tipo === filtroTipo) &&
        (filtroStatus === "todos" || (usuario.status ? "ativo" : "inativo") === filtroStatus)
    );

    // Paginação
    const totalPaginas = Math.ceil(usuariosFiltrados.length / itensPorPagina);
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    const usuariosPaginados = usuariosFiltrados.slice(inicio, fim);

const mudarPagina = (pagina) => {
        if (pagina >= 1 && pagina <= totalPaginas) {
            setPaginaAtual(pagina);
        }
    };

    return (
        <div className="m-7">
            <div>
                <h1 className="text-red-500 font-black text-5xl mt-4">USUÁRIOS</h1>
                <h3 className="font-bold">Crie e gerencie os dados de clientes e funcionários.</h3>
                <hr className="border-y-2 w-full mt-2 border-gray-200" />
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap mt-4 ml-10 gap-4 items-center">
                <div className="relative">
                    <FiSearch size={20} className="text-red-500 absolute left-2 top-2.5" />
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        className="pl-8 pr-4 py-2 rounded-2xl border border-gray-300"
                        value={busca}
                        onChange={(e) => setBusca(e.target.value)}
                    />
                </div>

                <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="border px-4 py-2 rounded-2xl"
                >
                    <option value="todos">Todos os tipos</option>
                    <option value="cliente">Cliente</option>
                    <option value="funcionário">Funcionário</option>
                </select>

                <select
                    value={filtroStatus}
                    onChange={(e) => setFiltroStatus(e.target.value)}
                    className="border px-4 py-2 rounded-2xl"
                >
                    <option value="todos">Todos os status</option>
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                </select>

                <button
                    className="bg-green-400 p-1 pl-4 pr-4 rounded-2xl font-bold transition-colors duration-300 ease-in-out hover:bg-green-500"
                    onClick={toggleForm}
                >
                    +ADICIONAR
                </button>
            </div>

            {/* Cabeçalho */}
            <div className="bg-gray-200 h-auto mt-4 p-4 rounded-2xl font-bold text-base text-gray-600">
                <div className="flex justify-evenly">
                    <div>Nome</div>
                    <div>Telefone</div>
                    <div>E-mail</div>
                    <div>Tipo</div>
                    <div>Status</div>
                </div>
            </div>

            {/* Lista */}
            <div className="space-y-2 mt-4">
                {usuariosPaginados.length > 0 ? (
                    usuariosPaginados.map((usuario, index) => (
                        <div
                            key={index}
                            className="flex justify-evenly p-4 bg-white shadow rounded-md text-gray-700"
                        >
                            <div className="w-1/5 text-center">{usuario.name}</div>
                            <div className="w-1/5 text-center">{usuario.phone}</div>
                            <div className="w-1/5 text-center">{usuario.email}</div>
                            <div className="w-1/5 text-center capitalize">{usuario.tipo || "cliente"}</div>
                            <div className="w-1/5 text-center capitalize">{usuario.status ? "ativo" : "inativo"}</div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">Nenhum usuário encontrado.</p>
                )}
            </div>

            {/* Paginação */}
            {totalPaginas > 1 && (
                <div className="flex justify-center gap-2 mt-6">
                    <button
                        onClick={() => mudarPagina(paginaAtual - 1)}
                        disabled={paginaAtual === 1}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        Anterior
                    </button>

                    {[...Array(totalPaginas)].map((_, i) => (
                        <button
                            key={i}
                            onClick={() => mudarPagina(i + 1)}
                            className={`px-3 py-1 rounded border ${
                                paginaAtual === i + 1
                                    ? "bg-red-500 text-white"
                                    : "bg-white text-gray-700"
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}

                    <button
                        onClick={() => mudarPagina(paginaAtual + 1)}
                        disabled={paginaAtual === totalPaginas}
                        className="px-3 py-1 rounded border disabled:opacity-50"
                    >
                        Próxima
                    </button>
                </div>
            )}

            {/* Formulário lateral */}
            {showForm && (
                <div className="fixed bottom-0 right-0 h-full w-1/4 bg-gray-300 shadow-2xl p-6 rounded-tl-2xl rounded-bl-2xl border-t flex flex-col">
                    <button
                        className="text-2xl text-black ml-2 self-end hover:bg-gray-300 hover:text-gray-500"
                        onClick={toggleForm}
                    >
                        <FiXCircle size={30} />
                    </button>
                    <h2 className="text-2xl font-bold text-center m-2">Adicionar Usuário</h2>

                    <div className="mt-8 space-y-4">
                        <input
                            type="text"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />
                        <input
                            type="text"
                            placeholder="Telefone"
                            value={telefone}
                            onChange={(e) => setTelefone(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        />

                        <select
                            value={tipo}
                            onChange={(e) => setTipo(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="" disabled>Selecione o tipo</option>
                            <option value="cliente">Cliente</option>
                            <option value="funcionário">Funcionário</option>
                        </select>

                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border rounded-lg"
                        >
                            <option value="" disabled>Selecione o status</option>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                        </select>
                    </div>

                    <button
                        onClick={handleSubmit}
                        className="bg-green-500 hover:bg-green-400 text-white font-bold px-4 py-2 rounded-lg absolute bottom-6 left-1/2 transform -translate-x-1/2 w-24"
                    >
                        Salvar
                    </button>
                </div>
            )}
        </div>
    );
}
