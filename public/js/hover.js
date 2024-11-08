
// Pega a URL atual sem a barra no final, se existir
const currentPath = window.location.pathname.replace(/\/$/, "");

// Seleciona todos os links da sidebar
const links = document.querySelectorAll('.sidebar a');

// Percorre cada link e verifica se a URL é a atual
links.forEach(link => {
    // Remove a barra final do href para comparação
    const linkPath = link.getAttribute('href').replace(/\/$/, "");

    if (linkPath === currentPath) {
        link.classList.add('active'); // Adiciona a classe 'active' ao link correspondente
    }
});
