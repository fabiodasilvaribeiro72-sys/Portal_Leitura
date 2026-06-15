const search = document.getElementById("searchInput");

if (search) {

    search.addEventListener("keyup", function () {

        const filtro = search.value.toLowerCase();

        const livros = document.querySelectorAll(".livros");

        livros.forEach(function(livro){

            const texto = livro.innerText.toLowerCase();

            if(texto.includes(filtro)){
                livro.style.display = "";
            }else{
                livro.style.display = "none";
            }

        });

    });

}