# ReLoop

## Introdução

O sistema de doação e troca surge para resolver a falta de uma plataforma centralizada que conecte pessoas que querem doar, trocar ou receber itens. Muitas pessoas possuem objetos em bom estado sem uso, enquanto outras precisam exatamente desses itens, mas a falta de visibilidade e comunicação dificulta essa conexão.
A plataforma funciona como um ambiente online simples e seguro, onde os usuários podem cadastrar itens com fotos, buscar produtos por filtros e enviar solicitações. Seu público inclui indivíduos e grupos que desejam praticar consumo consciente, reduzir desperdícios e incentivar a sustentabilidade.
Com isso, o sistema facilita o reaproveitamento de objetos e fortalece a colaboração dentro da comunidade.

## Tecnologias utilizadas

- Visual Code Studio
- React JS
- HTML
- JS
- CSS
- Google Drive
- Figma
- Github
- pgAdmin 4
- Nodejs
- Canva
- API Gemini
- API Cloudinary para armazenamento de imagens

## Integrantes👨‍💻👩‍💻

- [johan-akn](https://github.com/johan-akn) 
- [isadauzaker](https://github.com/isadauzaker) 
- [Emi-Souza](https://github.com/Emi-Souza) 
- [Gucrima](https://github.com/Gucrima) 
- [josehvinii](https://github.com/josehvinii)
- [Gabriel](https://github.com/GabrielFerLacerda)


### [Documentação](https://https://docs.google.com/document/d/1-5il-hP7aghns6neNqbO1eV6fVt6aM1eWINE8t0SR1s/edit?tab=t.0)


  ## Script para criação e população de dados
  ```
  CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,    
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,       
    senha TEXT NOT NULL,
    telefone TEXT
  );


  
  CREATE TABLE itens (
      id_item SERIAL PRIMARY KEY,    
      titulo TEXT NOT NULL,
      descricao TEXT NOT NULL,
      tipo_negocio TEXT NOT NULL,       -- 'Doacao' ou 'Troca'
      condicao TEXT NOT NULL,           -- 'Novo', 'Usado - Bom', etc.
      imagem TEXT,
      status TEXT,
      categoria TEXT NOT NULL,
      troca_por TEXT,                   -- Item ou categoria desejada em caso de troca
      fk_id_usuario INTEGER NOT NULL,
      CONSTRAINT fk_usuario_proprietario
          FOREIGN KEY (fk_id_usuario)
          REFERENCES usuarios (id_usuario)
          ON DELETE CASCADE,
      CONSTRAINT chk_troca_por_required
          CHECK (tipo_negocio <> 'Troca' OR (troca_por IS NOT NULL AND troca_por <> ''))
  );
  
  -- Usuários
  INSERT INTO usuarios (id_usuario, nome, email, senha, telefone) VALUES
      (1, 'João Silva', 'joao.silva@email.com', '123456', '11987654321'),
      (2, 'Maria Santos', 'maria.santos@email.com', '123456', '21998765432'),
      (3, 'Pedro Oliveira', 'pedro.oliveira@email.com', '123456', '31912345678');
  
  -- Itens
  INSERT INTO itens (id_item, titulo, descricao, tipo_negocio, condicao, imagem, status, categoria, troca_por, fk_id_usuario) VALUES
      (1, 'Jaqueta de Couro Vintage',
          'Jaqueta de couro marrom clássica em excelente condição. Tamanho M.',
          'Troca', 'Usado - Bom', 'https://img.olx.com.br/images/78/785543820281210.jpg', 'disponivel', 'Roupas', 'Outra jaqueta tamanho M ou acessórios de inverno', 1),
  
      (2, 'Livros de Programação',
          'Coleção de livros de JavaScript e Python. Perfeito para iniciantes.',
          'Doação', 'Usado - Bom', 'https://img.olx.com.br/images/66/666567542227611.webp', 'disponivel', 'Livros', NULL, 2),
  
      (3, 'Fones de Ouvido Sem Fio',
          'Sony WH-1000XM3 wireless. Pequenos arranhões mas funciona perfeitamente.',
          'Troca', 'Usado - Razoavel', 'https://img.olx.com.br/images/17/175574582687973.jpg', 'disponivel', 'Eletrônicos', 'Aceito troca por smartwatch ou caixa de som', 1),
  
      (4, 'Kit de Plantas Indoor',
          'Conjunto de 3 plantas em vasos. Ótimo para decoração de casa.',
          'Doação', 'Novo', 'https://img.olx.com.br/images/65/651519342940261.jpg', 'disponivel', 'Casa & Jardim', NULL, 3),
  
      (5, 'Tapete de Yoga e Acessórios',
          'Tapete de yoga premium com blocos e cinta. Pouco usado.',
          'Troca', 'Usado - Bom', 'https://img.olx.com.br/images/33/338560462520918.jpg', 'disponivel', 'Esportes & Lazer', 'Troco por halteres ou corda de pular', 2),
  
      (6, 'Liquidificador de Cozinha',
          'Liquidificador de alta potência perfeito para smoothies e sopas.',
          'Doação', 'Usado - Bom', 'https://img.olx.com.br/images/72/720560467083693.jpg', 'disponivel', 'Casa & Jardim', NULL, 3);

  SELECT setval('usuarios_id_usuario_seq', (SELECT MAX(id_usuario) FROM usuarios));
  SELECT setval('itens_id_item_seq', (SELECT MAX(id_item) FROM itens));
  ```
