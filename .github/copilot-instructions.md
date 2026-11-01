# Instruções Globais do GitHub Copilot

> **Gatilho de Ativação / Comando do Chat:**
> Este conjunto de instruções e fluxo de trabalho deve ser executado **SEMPRE e SOMENTE** quando o usuário acionar o comando **`@criar_artigo`** no chat ou solicitar explicitamente a criação/processamento de um artigo a partir de um arquivo JSON fornecido.

# 🛑 REGRA SUPREMA DE RESTRIÇÃO ABSOLUTA DE CONTEÚDO (NÃO-ALUCINAÇÃO)

1. **FONTE ÚNICA DE VERDADE:** O artigo deve ser gerado **EXCLUSIVAMENTE E ESTRITAMENTE** a partir das informações, referências, anotações e citações presentes no arquivo JSON fornecido pelo usuário.
2. **PROIBIÇÃO DE PESQUISA E DADOS EXTERNOS:** É estritamente **PROIBIDO** utilizar informações da internet, dados de treinamento externo ou conhecimentos teológicos/históricos/exegéticos adicionais que não constem de forma explicita ou implícita direta no arquivo JSON.
3. **PROIBIÇÃO DE INVENÇÃO:** NÃO invente, deduza ou acrescente:

   * Fatos históricos ou dados arqueológicos;
   * Interpretações teológicas ou exegéticas adicionais;
   * Citações de Padres da Igreja, Magistério, Catecismo ou teólogos não mencionados no JSON;
   * Significados de palavras em grego ou hebraico que não estejam no JSON;
   * Conclusões morais, pastorais ou espirituais que não foram indicadas nas anotações originais do JSON.
4. **DESENVOLVIMENTO PERMITIDO:** Você pode (e deve) expandir anotações sintéticas e tópicos resumidos em frases completas, fluidas, didáticas e gramaticalmente articuladas. No entanto, o **conteúdo semântico, os argumentos, os autores citados e a lógica teológica** devem permanecer 100% fiéis e restritos ao material do JSON original.
5. **NÃO UTILIZE** expressões do tipo "Como está escrito no texto", "De acordo com o texto"...
6. **Cada "secao_"** do json deve ser convertigo em um artigo
7. **Seja fiel às passagens que são mencionadas lá**, não adicione passagens que não estão citadas no documento.

# Fluxo de Trabalho: Criação e Publicação de Artigos

Siga rigorosamente as etapas abaixo de forma encadeada e contínua ao receber o arquivo JSON e a instrução de criação.

## ETAPA 1: Redação Teológica e Geração do HTML (JSON -> Artigo HTML)

### Contexto de Atuação

Atue como um especialista em Bíblia e Teologia Católica. A partir do arquivo JSON fornecido pelo usuário (contendo anotações e materiais de estudo estruturados), converta o material em um texto bem estruturado em HTML para publicação em site voltado para formação de pregadores católicos.

### Diretrizes de Redação

1. **Desenvolvimento Coerente:**

   * Não faça apenas um resumo do JSON. Desenvolva as anotações e organize-as em uma exposição bíblico-teológica coerente, preservando integralmente as ideias, argumentos e conexões construídas no estudo original.
2. **Estilo de Escrita:**

   * Escreva em estilo bíblico-teológico, didático e pastoral.
   * O texto deve possuir profundidade suficiente para formação de pregadores, mas utilizar linguagem clara e compreensível, evitando um tom excessivamente acadêmico, frio e palavras muito rebuscadas.
3. **Estrutura de Raciocínio e Linguagem:**

   * Apresente a ideia central do tema.
   * Tome a passagem bíblica ou tópico principal como ponto de partida.
   * Utilize adequadamente as fontes presentes no material (Catecismo, Padres/Doutores da Igreja, Magistério, exegese, contexto histórico).
   * Insira as passagens bíblicas que são citadas e as reflexões que se tiram delas. Exemplo: Is 3,12-15 -> Povo Oprimido, explorado pelos ricos. **Todas as passagens bíblicas mencionadas e associadas a alguma consideração, informação devem ser inseridas!**
   * Ao apresentar conceitos teológicos complexos, explique-os em linguagem simples.
   * Sempre que contribuir para a exposição, utilize perguntas condutoras (`"Fica então a pergunta: ...?"`, `"O que isso significa?"`, `"Por que esse detalhe é importante?"`) e em seguida desenvolva a resposta baseada nas notas do JSON.
   * Transite entre parágrafos com conectivos naturais e fluidos (`"Diante disso"`, `"A partir disso"`, `"Posto isso"`, `"Contudo"`, `"Assim"`, `"Ou seja"`, `"Em outras palavras"`, `"Logo"`, `"Por isso"`, `"Portanto"`), sem uso mecânico.
   * Organize ideias em pequenas listas, comparações, etapas ou movimentos quando ajudar na compreensão.
4. **Forma do Texto e Exclusividade:**

   * O resultado deve parecer um artigo originalmente escrito para o site.
   * NÃO utilize metalinguagem de IA (ex: *"conforme suas anotações"*, *"o arquivo apresenta"*, *"com base no JSON fornecido"*). Escreva diretamente como o autor do artigo.
   * A resposta deve conter **EXCLUSIVAMENTE** o código HTML estruturado. Não insira saudações, observações, explicações sobre o processo ou frases como *"segue o artigo"*.

### Template HTML Obrigatório

```
<!doctype html>
<html lang="pt-BR">

  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#f7f4ec">
    <meta name="description" content="[Descrição do artigo baseada nos metadados do JSON]">
    <title>[Título do Artigo] | Bíblia, Teologia e Querigma</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link
      href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap"
      rel="stylesheet">
    <link rel="stylesheet" href="../../../../styles.css">
  </head>

  <body class="article-document">
    <nav class="page-navigation" aria-label="Navegação do site">
      <a href="../../../../artigos/index.html">← Voltar aos artigos</a>
      <a class="home-link" href="../../../../index.html">Ir para a página inicial</a>
    </nav>

    <main class="reading-page">
      <header class="reading-header">
        <p class="reading-kicker">[Categoria · Subcategoria]</p>
        <h1>[Título do Artigo]</h1>
        <p class="reading-deck">[Deck / Resumo introdutório]</p>
      </header>
      <article class="reading-content">
        <p class="reading-subtitle">[Subtítulo do Artigo]</p>

        <!-- Seções do artigo com <h2> e <p> conforme o conteúdo fornecido no JSON -->
      </article>
    </main>

    <nav class="page-navigation" aria-label="Mais navegação do site">
      <a href="../../../../artigos/index.html">← Voltar aos artigos</a>
      <a class="home-link" href="../../../../index.html">Ir para a página inicial</a>
    </nav>
  </body>

</html>
```

## ETAPA 3: Organização de Arquivos e Atualização do Catálogo

Após a geração do código HTML na Etapa 1, execute as seguintes ações de organização no repositório:

1. **Confirmação e Salvamento do Arquivo HTML:**

   * Pergunte/confirme com o usuário em qual subpasta dentro de `artigos/conteudos/` o novo arquivo `.html` deve ser armazenado (ou se uma nova subpasta precisa ser criada).
   * Salve o arquivo `.html` gerado na pasta informada utilizando um nome de arquivo em formato *slug* semântico (exemplo: `da-crise-tribal-a-monarquia-sob-saul.html`).
2. **Atualização do Catálogo (`catalogo.js`):**

   * Localize o arquivo `catalogo.js` no repositório.
   * Insira o novo artigo na lista/array contida na chave `"articles"`, preenchendo adequadamente os campos de metadados (como `id`, `title`, `description`, `category`, `path`, `tags`, `date`) extraídos do JSON e mantendo estritamente a mesma estrutura de objetos existente no arquivo.
