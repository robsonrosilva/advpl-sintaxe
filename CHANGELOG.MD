# ChangeLog

## Release Notes

### 1.5.04

- Desativação da correção de erros ainda em desenvolvimento.

### 1.5.03

- Atualização de analise de fonte, foi corrigida a sintaxe de algumas sentenças do REGEX.

### 1.5.01

- Remoção de identação de begin report ele não tem que ser estruturada pode estar de de IF's e funciona.
- Correção de Next( não estava entendendo o fechamento.

### 1.5.00

- Implementação de cache com hash para otimização da gravação.

### 1.4.29

- Fixação de snnipets para corrigir pela mudança na forma de tradução do package.json.
- Atualização de bibliotecas para receber a melhoria na análise de fontes incorporando as críticas das funções obsoletas e das descontinuadas na versão 12.1.2210.

### 1.4.28

- Correção de tradução.

### 1.4.27

- Ajuste de espaços em query.

### 1.4.25

- Adição de crítica na análise de uso de funções restritas para adição de BeginTran e EndTran.

### 1.4.24

- Identação correta de While Terminado em End Do.

### 1.4.23

- Correção de análise de tabelas fixas nas queryes.

### 1.4.21

- Correção de fechamento de FOR estava fechando indevidamente.

### 1.4.20

- Análise de funções de uso restrito conforme validação do appserver 12.1.33.

### 1.4.19

- Tratamento para não identar as expressões injetadas no fonte quando há conflito no GIT.

### 1.4.18

- Tratamento de sintaxe de while terminado em "End While".

### 1.4.17

- Correção de validação de include do PUBLISH USER MODEL do MVC.

### 1.4.16

- Melhoria de definição dos parâmetros no settings.

### 1.4.15

- Remoção de espaços quando usado array em expressão de query.

### 1.4.14

- Otimização de identação para enviar somente linhas modificadas.
- Montagem inicial de fluxos para flows GIT.

### 1.4.13

- Correção de identação de expressão que pega atributo de objeto em query.

### 1.4.12

- Correção de identação de query com COLUMN x AS no começo da query.

### 1.4.11

- Permite o fechamento da tela que mostra que está ocorrendo análise.
- Correção de travamento de análise de projeto.

### 1.4.9

- Correção de regex de quebra de linha em ON de JOIN.
- Inclusão de resolve e mensagem de erro quando ocorrer problema na validação de projeto.

### 1.4.8

- Pergunta de linguagem de query que deseja usar na formatação de queries.
- Parâmetros de query globais para usar em extensões diferentes.
- Definição de encoding padrão para advpl.

### 1.4.7

- Correção de identação de Select após %noparser%.
- Correção de espaço no fim da linha antes quebra de on, join, when ou then.
- Correção de query que estava quebrando por causa de '\' na query.
- Correção de identação de case quando enviado para a formatação , case.

### 1.4.6

- Correção de Espaçamentos em query.

### 1.4.5

- Linha começa com \* dentro da query, nestes cassos foi removida a quebra de linha, pois o compilador ignora a linha.

### 1.4.4

- Remoção de espaço entre definição de tabela e notdel.

### 1.4.3

- Criação de configuração para definição de linguagem de banco.
- Melhoria de sintaxe de between, join, on, case para melhorar a leitura de queries.

### 1.4.2

- Criação de parâmetro para desabilitar formatação de queries.

### 1.4.1

- Correção de espaçamento de queries para evitar erro de execução.

### 1.4.0

- Implementação de novo identador, mais rápido e tratando as estruturas assíncronas.
- Implementação de identação de queryes em EmbeddedSql usando [sql-formatter-plus](https://www.npmjs.com/package/sql-formatter-plus).

### 1.3.0

- Validação de FreeObj(self), conforme binário 12.1.27 de outubro/2020.

### 1.2.3

- Correção de identação indevida de textos de conflito do GIT.
- Correção de identação de if encerrado com "end if".
- Correção de críticas indevidas de "COPY TO ". [Issue 26](https://github.com/robsonrosilva/advpl-sintaxe/issues/26)
- Correção de críticas indevidas de DBUSEAREA com TOPCONN. [Issue 25](https://github.com/robsonrosilva/advpl-sintaxe/issues/25)

### 1.2.2

- Implementação de formatação parcial de código.
- Implementação de formatação de begin content.
- Criação de tag para não formatar dentro da expressão. `/*{*/ ...... /*}*/`
- Correção de Identação de DoCase.

### 1.1.10

- Correção de identificação de funções.
- Correção de identificação de nomes de WEBSERVICES, WSSTRUCT e WSRESTFUL.
- Identaçao de WSMETHOD.
- Tratamentos para function ; return e if ; ; endif.

### 1.1.9

- Remoção de tabulações e espaços antes da identação.
- Correção de If inline sem dados nos parâmetros.
- Alteração de validação para processamento de forma assíncrona.

### 1.1.8

- Correção de publicação, foi publicada uma versão parcialmente pronta.

### 1.1.7

- Tratamento de identificação de if com espaços, negação ou tabulações.
- Tratamento de identificação de case terminado com enddo.
- Tratamento de identificação de for terminado com end.
- Correção de análise de Estrutura em protheusDoc.
- Tratamento de comentários após a quebra de linha(;).
- Tratamento de if que termina com "END IF".
- Ajuste de identificação de functions.

### 1.1.6

- Tratamento para correção de identação de if inline.
- Tratamento para correção de /\*/ que fecha comnentário multiline.

### 1.1.5

- Correção de identação de quebra de linha(;) com linha posterior compatível com uma estrura identável.

### 1.1.4

- Tratamento para correção de comentário multiline que encerra na mesma linha.

### 1.1.3

- Correção de travamento em avaliação de if na Formatação.

### 1.1.2

- Correção de loop em formatação.

### 1.1.1

- Correção de identação de comentários.

### 1.1.0

- Implementação de Formatação de Fonte ADVPL.

### 1.0.8

- Ajuste de execução assincrona.

### 1.0.7

- Correção de identificação de arquivos e funções duplicadas.

### 1.0.6

- Correção de atualização de Branch, não estava dando o checkout antes do merge.

### 1.0.5

- Correção de validação quando desativa a validação do projeto.
- Adição de ativações da extensão do TDS.
- Validação de fonte na abertura, alteração, seleção e salvamento.
- Correção de validação de funções com X?\_.

### 1.0.4

- Define um tempo de 5 segundos entre a digitação do editor e o início da validação, para melhoria de performance.
- Foi criada uma configuração para modificar o tempo de intervalo caso deseje.

### 1.0.3

- Criação de comando para limpar branche apagadas do remote e as branches locais mergeadas com a branche de produção.
- Atualização de análise de advpl, para melhoria de críticas de uso de dicionários.
- Criação de método mais genérico de uso do GIT.
- Tratamento para uso do git de forma assíncrona.

### 1.0.2

- Tratativa alternativa para uso de push tags.

### 1.0.1

- Implementação de GitFollowTags conforme atualização do GIT.

### 1.0.0

- Execução de análise de forma assíncrona.
- Reformulação de aplicação para simplificação e melhoria de performance.
- Correção do controle de erros.
- Correção do controle de duplicidades de fontes e funções.
- Remoção do cache.

### 0.8.1

- Correção de análise de uso indevido de dicionários somente fora de query.

### 0.8.0

- Correção de identificação indevida de uso de dicionário.

### 0.7.9

- Implementação de análise de uso de dicionários.
- Implementação de análise de uso de ISAM.
- Implementação de análise de uso de PUTSX1.

### 0.7.8

- Tratamento de erros de validação.
- Remoção de limite de cache.
- Atualização de análise de Advpl.
- Criação de Snippets de Linguagem.

### 0.7.7

- Melhoria de cache, mas ainda limitando a 500 fontes.
- Correção de obtenção de repositório GIT após a mudança no vscode.

### 0.7.6

- Criação de cache para acelerar revalidações de fontes.
- Correção de tradução de modulo de validação advpl.

### 0.7.5

- Melhoria de rotina que busca arquivos no projeto para uma mais rápida(globby).
- Compactação de projeto para melhorar performance.
- Correção de busca de repositório quando não há fontes abertos.

### 0.7.4

- Alteração de mecanismo de busca de arquivos para dentificar de forma incasesensitive.
- Mudanas de LOOP para melhorar performance.
- Atualização de módulo advpl.

### 0.7.3

- Correção de internacionalização de package.json.
- Inicio de implementação de internacionalização de snippets.

### 0.7.1

- Ajuste para não analisar o projeto no meio do merge.

### 0.7.0

- Adição de mensagens que faltavam em alguns processamentos de Merge.
- Implementação de atualização da branch corrente antes de enviar para release.
- Melhoria de rotina funcionalidades de Merge para otimização de checkOuts.
- Correção de erros que ficavam quando o fonte era renomeado ou deletado.

### 0.6.14

- Atualização de pacote de análise de advpl, para implementação de correção de análise de includes para WebServices REST.

### 0.6.13

- Correção de limpeza indevida de erro de duplicidade.

### 0.6.12

- Correção na adição de erro de duplicidade.

### 0.6.11

- Melhoria de performance de atualização de duplicados.

### 0.6.8

- Crítica de funções ou classes duplicadas no projeto.

### 0.6.7

- Remoção de mensagem Welcome.

### 0.6.6

- Foram removidas as chamadas da validação de projeto para utilizar um só independentemente de onde chama a rotina.

### 0.6.5

- Foram removidos desse projeto os fontes de análise de advpl, pois segmentei em um projeto NPM. O projeto NPM visa possibilitar a análise de ADVPL via CI do GITLAB.
- Mudança de forma de tradução.

### 0.5.5

- Ajuste de espaço na identificação de ProtheusDoc.

### 0.5.4

- Finalização de internacionalização para inglês, troca de mensagens padrão para inglês.

### 0.5.3

- Inicio de internacionalização para inglês.
- Ajustes de identificação de função.

### 0.5.2

- Correção de Internacionalização na descrição, de forma paleativa.

### 0.5.0

- Implementação de Internacionalização.

### 0.4.9

- Melhoria na identificação de Includes.
- Adição de análise de APWEB.CH.

### 0.4.8

- Melhoria na identificação de falta de BeginSql.
- Melhoria na identificação de ConOut().
- Ajuste de Expressões para utilizar de forma mais otimizada.
- Padronização de comentários em snippets.

### 0.4.7

- Correção de tratamento de comentários.

### 0.4.6

- Identificação de Array.ch.

### 0.4.5

- Análise de expressões de includes somente com o texto sem comentários e strings.
- Análise de Includes contidos em outros.
- Simplificação de expressões de Includes.
- Análise de Parâmetro MV_FOLMES e MSGBOX que foram descontinuados para o Protheus 12.
- Correção de bug de identificação de classe fix #1.

### 0.4.4

- Correção de identificação de funções.

### 0.4.3

- Inclusão de includes obsoletos - STDWIN, SET.

### 0.4.2

- Inclusão de icone de extensão e melhoria de padrões de README.

### 0.4.1

- Ajuste de identificação de includes FWMVCDEF.CH e REPORT.CH.
- Ajuste de exibição de erros em todas as linhas quando faltar o include.
- Melhoria de identificação de comentários em linhas.

### 0.4.0

- Montagem de objeto de análise de includes.
  - Analisados - TOPCONN, TBICONN, REPORT, AP5MAIL, APWIZARD, FILEIO, TBICODE, PARMTYPE, FWMVCDEF, AARRAY, RPTDEF,
    FWPRINTSETUP, APWEBSRV, APWEBEX e MSOLE.
  - Obsoletos - PROTHEUS, DIALOG, FONT, PTMENU, PRINT, COLORS, FOLDER, MSOBJECT, VKEY, WINAPI, FWCOMMAND e FWCSS.

### 0.3.7

- Crítica de RWMAKE.CH, REPORT.CH obsoleto.

### 0.3.6

- Correção de erro de identificação de PROTHEUS.CH.

### 0.3.5

- Crítica de PROTHEUS.CH obsoleto.

### 0.3.4

- Análise de TBICONN.CH sem PREPARE ENVIRONMENT.
- Análise de PREPARE ENVIRONMENT sem TBICONN.CH.
- Análise de includes duplicados.

### 0.3.3

- Correção de mensagens dadas quando for executar TcSqlExec.

### 0.3.2

- Correção de mensagem na análise de projeto.

### 0.3.1

- Tratamentos de erros na extensão.
- Ajuste de mensagem de MERGE.

### 0.3.0

- Mudança de execução de rotinas de forma síncrona.

### 0.2.1

- Ajuste de identificação de tabela fixas.

### 0.2.0

- Criação de análise de tags, onde serão varridas as tags do padrão N.N.N e gerado um arquivo na raiz com as pendências de cada TAG.
- Melhorada a identificação de tabelas fixas em queries.

### 0.1.1

- Melhoria na identificação UPDATE, SELECT, JOIN e DELETE na mesma linha.

### 0.1.0

- Melhoria na identificação de comentários.

### 0.0.9

- Executa as validações de projeto quando chama as rotinas do GIT.

### 0.0.8

- Correção do Fluxo de merge para a Master.
- Criticas de DELETE FROM.
- Criticas de Erro de Commit.

### 0.0.7

- Montagem de settings para padrão de comentário de fonte.

### 0.0.6

- Implementação para aceitar vários bancos de dados.
- Ajuste para identificação no Settings de configurações de extensão.
- Segregação de classes de Merge e de Validação.
- Melhoria de identificação de banco de dados fixo no fonte.
- Recomendação de identação de queryes para melhor análise.

### 0.0.5

- Alteração de classificações de mensagens de Error para Warning.
- Criação de regra para verificar tabelas fixas em query.

### 0.0.4

- Criação de informação para comentário de fonte fora do padrão.
- Identificação de fontes com extensão em caixa alta.
- Adição de Snippets.
- Criação de comando para validação de projeto.
- Criticas de comentários de fontes e funções.

### 0.0.3

- Criado variável cSelect para identificar Query e validar o owner.
- Criação de variáveis de Workspace para extensão.
- Melhoria na identificação de owner.

### 0.0.2

- Validação de todo o projeto na abertura.
- Ajuste de validação que Select com \*.
- Alert para utilização de CRLF em vez de funções.

### 0.0.1

- Foi implementada a Validação de fontes básica e os merges.
