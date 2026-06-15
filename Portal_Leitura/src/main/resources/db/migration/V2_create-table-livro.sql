CREATE TABLE livro (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    autor VARCHAR(255),
    categoria VARCHAR(255),
    titulo VARCHAR(255),
    ano INT,
    editora VARCHAR(255),
    edicao INT,
    paginas INT,
    sinopse TEXT,
    dimensoes VARCHAR(255),
    preco DOUBLE,
    isbn VARCHAR(255),
    quantidade_estoque INT
);







