const SUPABASE_URL = 'https://kkjagoqelzvqaknwvibg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtramFnb3FlbHp2cWFrbnd2aWJnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI5ODI1NzEsImV4cCI6MjEwODU1ODU3MX0.ZAscGrEBMECtgrUfoYs9J5d7mhiwwJPbOZ6PV6IUnyw';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById('itemForm');
const listaItensDiv = document.getElementById('listaItens');
const btnSalvar = document.getElementById('btnSalvar');

// LER (SELECT)
async function carregarItens() {
    listaItensDiv.innerHTML = '<p>Carregando...</p>';
    
    const { data, error } = await supabaseClient
        .from('cadastros')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Erro ao buscar dados:', error);
        listaItensDiv.innerHTML = '<p>Erro ao carregar os dados.</p>';
        return;
    }

    listaItensDiv.innerHTML = '';
    
    if (data.length === 0) {
        listaItensDiv.innerHTML = '<p>Nenhum registro encontrado.</p>';
        return;
    }

    data.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = `
            <div>
                <strong>${item.nome}</strong> - ${item.email} (${item.telefone || 'Sem tel'}) - ${item.cidade || 'Sem cidade'}
            </div>
            <div class="acoes">
                <button onclick="prepararEdicao(${item.id}, '${item.nome}', '${item.email}', '${item.telefone || ''}', '${item.cidade || ''}')">Editar</button>
                <button class="btn-excluir" onclick="excluirItem(${item.id})">Excluir</button>
            </div>
        `;
        listaItensDiv.appendChild(card);
    });
}

// INSERIR (CREATE) E EDITAR (UPDATE)
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('itemId').value;
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const cidade = document.getElementById('cidade').value;

    if (id === "") {
        // INSERIR
        const { error } = await supabaseClient
            .from('cadastros')
            .insert([{ nome, email, telefone, cidade }]);

        if (error) alert('Erro ao inserir: ' + error.message);
    } else {
        // EDITAR
        const { error } = await supabaseClient
            .from('cadastros')
            .update({ nome, email, telefone, cidade })
            .eq('id', id);

        if (error) alert('Erro ao atualizar: ' + error.message);
        
        document.getElementById('itemId').value = '';
        btnSalvar.textContent = 'Adicionar Registro';
    }

    form.reset();
    carregarItens();
});

// PREPARAR DADOS PARA EDIÇÃO
window.prepararEdicao = function(id, nome, email, telefone, cidade) {
    document.getElementById('itemId').value = id;
    document.getElementById('nome').value = nome;
    document.getElementById('email').value = email;
    document.getElementById('telefone').value = telefone;
    document.getElementById('cidade').value = cidade;
    btnSalvar.textContent = 'Salvar Alterações';
};

// EXCLUIR (DELETE)
window.excluirItem = async function(id) {
    if (confirm('Deseja realmente excluir este registro?')) {
        const { error } = await supabaseClient
            .from('cadastros')
            .delete()
            .eq('id', id);

        if (error) {
            alert('Erro ao excluir: ' + error.message);
        } else {
            carregarItens();
        }
    }
};

carregarItens();