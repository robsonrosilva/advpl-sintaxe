# ChangeLog

## Release Notes

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

### 0.5.5 - 2018-11-19

- Ajuste de espaço na identificação de ProtheusDoc.

### 0.5.4 - 2018-10-31

- Finalização de internacionalização para inglês, troca de mensagens padrão para inglês.

### 0.5.3 - 2018-10-31

- Inicio de internacionalização para inglês.
- Ajustes de identificação de função.

### 0.5.2 - 2018-10-27

- Correção de Internacionalização na descrição, de forma paleativa.

### 0.5.0 - 2018-10-27

- Implementação de Internacionalização.

### 0.4.9 - 2018-10-24

- Melhoria na identificação de Includes.
- Adição de análise de APWEB.CH.

### 0.4.8 - 2018-10-24

- Melhoria na identificação de falta de BeginSql.
- Melhoria na identificação de ConOut().
- Ajuste de Expressões para utilizar de forma mais otimizada.
- Padronização de comentários em snippets.

### 0.4.7 - 2018-10-23

- Correção de tratamento de comentários.

### 0.4.6 - 2018-10-23

- Identificação de Array.ch.

### 0.4.5 - 2018-10-23

- Análise de expressões de includes somente com o texto sem comentários e strings.
- Análise de Includes contidos em outros.
- Simplificação de expressões de Includes.
- Análise de Parâmetro MV_FOLMES e MSGBOX que foram descontinuados para o Protheus 12.
- Correção de bug de identificação de classe fix #1.

### 0.4.4 - 2018-10-22

- Correção de identificação de funções.

### 0.4.3 - 2018-10-22

- Inclusão de includes obsoletos - STDWIN, SET.

### 0.4.2 - 2018-10-21

- Inclusão de icone de extensão e melhoria de padrões de README.

### 0.4.1 - 2018-10-21

- Ajuste de identificação de includes FWMVCDEF.CH e REPORT.CH.
- Ajuste de exibição de erros em todas as linhas quando faltar o include.
- Melhoria de identificação de comentários em linhas.

### 0.4.0 - 2018-10-21

- Montagem de objeto de análise de includes.
  - Analisados - TOPCONN, TBICONN, REPORT, AP5MAIL, APWIZARD, FILEIO, TBICODE, PARMTYPE, FWMVCDEF, AARRAY, RPTDEF,
    FWPRINTSETUP, APWEBSRV, APWEBEX e MSOLE.
  - Obsoletos - PROTHEUS, DIALOG, FONT, PTMENU, PRINT, COLORS, FOLDER, MSOBJECT, VKEY, WINAPI, FWCOMMAND e FWCSS.

### 0.3.7 - 2018-10-19

- Crítica de RWMAKE.CH, REPORT.CH obsoleto.

### 0.3.6 - 2018-10-19

- Correção de erro de identificação de PROTHEUS.CH.

### 0.3.5 - 2018-10-19

- Crítica de PROTHEUS.CH obsoleto.

### 0.3.4 - 2018-10-19

- Análise de TBICONN.CH sem PREPARE ENVIRONMENT.
- Análise de PREPARE ENVIRONMENT sem TBICONN.CH.
- Análise de includes duplicados.

### 0.3.3 - 2018-10-18

- Correção de mensagens dadas quando for executar TcSqlExec.

### 0.3.2 - 2018-10-18

- Correção de mensagem na análise de projeto.

### 0.3.1 - 2018-10-17

- Tratamentos de erros na extensão.
- Ajuste de mensagem de MERGE.

### 0.3.0 - 2018-10-17

- Mudança de execução de rotinas de forma síncrona.

### 0.2.1 - 2018-10-16

- Ajuste de identificação de tabela fixas.

### 0.2.0 - 2018-10-16

- Criação de análise de tags, onde serão varridas as tags do padrão N.N.N e gerado um arquivo na raiz com as pendências de cada TAG.
- Melhorada a identificação de tabelas fixas em queries.

### 0.1.1 - 2018-10-10

- Melhoria na identificação UPDATE, SELECT, JOIN e DELETE na mesma linha.

### 0.1.0 - 2018-10-10

- Melhoria na identificação de comentários.

### 0.0.9 - 2018-10-08

- Executa as validações de projeto quando chama as rotinas do GIT.

### 0.0.8 - 2018-10-08

- Correção do Fluxo de merge para a Master.
- Criticas de DELETE FROM.
- Criticas de Erro de Commit.

### 0.0.7 - 2018-10-06

- Montagem de settings para padrão de comentário de fonte.

### 0.0.6 - 2018-10-05

- Implementação para aceitar vários bancos de dados.
- Ajuste para identificação no Settings de configurações de extensão.
- Segregação de classes de Merge e de Validação.
- Melhoria de identificação de banco de dados fixo no fonte.
- Recomendação de identação de queryes para melhor análise.

### 0.0.5 - 2018-10-05

- Alteração de classificações de mensagens de Error para Warning.
- Criação de regra para verificar tabelas fixas em query.

### 0.0.4 - 2018-10-05

- Criação de informação para comentário de fonte fora do padrão.
- Identificação de fontes com extensão em caixa alta.
- Adição de Snippets.
- Criação de comando para validação de projeto.
- Criticas de comentários de fontes e funções.

### 0.0.3 - 2018-10-04

- Criado variável cSelect para identificar Query e validar o owner.
- Criação de variáveis de Workspace para extensão.
- Melhoria na identificação de owner.

### 0.0.2 - 2018-10-04

- Validação de todo o projeto na abertura.
- Ajuste de validação que Select com \*.
- Alert para utilização de CRLF em vez de funções.

### 0.0.1 - 2018-10-04

- Foi implementada a Validação de fontes básica e os merges.
