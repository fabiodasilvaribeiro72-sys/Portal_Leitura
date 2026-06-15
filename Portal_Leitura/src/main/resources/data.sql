INSERT INTO livro
(autor, titulo, ano, editora, edicao, paginas, sinopse, dimensoes, preco, isbn, quantidade_estoque)
VALUES
('Machado de Assis', 'Dom Casmurro', 1899, 'Editora Brasil', 1, 256,
'Livro clássico brasileiro', '16x23', 49.90, '978000000001', 10),

('George Orwell', '1984', 1949, 'Companhia das Letras', 1, 320,
'Livro distópico', '16x23', 59.90, '978000000002', 15),

('J.R.R Tolkien','O Hobbit', 1937, 'Harper Collins', 2, 400,
'Aventura fantástica', '16x23', 79.90, '978000000003', 8),

('Charles Bukowski', 'Factotum', 1975, 'Harper Collins', 1, 272, 'Ficcao' , '13x15', 45.90, '9788577990641',20  ),

('Jane Austen', 'Orgulho e Preconceito', 1813, 'Martin Claret', 2, 424,'Livro de Drama de época/Romance', '21.4x13.6', 32.50, '1050632048622',30),

('Dan Brown','O Codigo da Vinci' , 2003, 'Arqueiro',1, 432, 'Policial/Thriller', '16x23',39.90, '9786555658118', 5),

('Asimov' , 'A Fundacao', 1951, 'Aleph', 5, 880, 'Trilogia de ficcao', '23x16', 42.00, '9788576571971',3),

('Fernando Pessoa','Poesias Completas',1951, 'Companhia das Letras', 1, 496, 'Coletanea de Poesia', '23x16', 55, '9788535939538', 5);

INSERT INTO cupom (codigo, aprovado, desconto, ativo, permite_troca) VALUES ('DESCONTO10', true, 10.0, true, false);