![Version](https://vsmarketplacebadge.apphb.com/version/robsonrosilva.advpl-sintaxe.svg) ![Installs](https://vsmarketplacebadge.apphb.com/installs/robsonrosilva.advpl-sintaxe.svg) ![Rating](https://vsmarketplacebadge.apphb.com/rating-short/robsonrosilva.advpl-sintaxe.svg)

# Leia-me
## Visual Studio Code ADVPL Análise e GIT
 
Esta extensão adiciona no visual code [VsCode MarketPlace](https://marketplace.visualstudio.com/items?itemName=robsonrosilva.advpl-sintaxe):
- Snippets da linguagem.
- Funcionalidades para promover os desenvolvimentos utilizando git de forma a enviar para homologação e produção de forma simples, gerando TAGS ao mergear para a branch de produção.
- Análise de qualidade e sintaxe de programas ADVPL.
- Comando para análise de evolução de qualidade por TAGS.

Caso você encontre algum problema ou queira dar alguma sugestão de melhoria, por favor abra uma issue no [GitHub](https://github.com/robsonrosilva/advpl-sintaxe/issues). 

# Instalação
1. Intalação Visual Studio Code 0.10.1 ou superior
2. Iniciar o Visual Studio Code
3. Na aba de pompt de comando `Ctrl-Shift-P` (Windows, Linux) ou `Cmd-Shift-P` (OSX)
4. Selecione Extensão
5. Digite `ADVPL`
6. Escolha a extensão
7. Recarregue Visual Studio Code

# Análise de Qualidade e Sintaxe
## ITENS ANALISADOS
Verifica se estão sendo utilizados padrões básicos de qualidade como:
 - EmbededSql em vez de TcQuery.
 - Include TOTVS.CH.
 - Includes desnecessários.
 - Includes que faltam.
 - Comentários desnecessários.
 - Padrões de comentários.
 - Comentários de todas as funções, métodos, webservices e classes.
 - Critica de uso de Connout.
 - Critica de conflitos de merge.
 - Utilização de CHR(13) + CHR(10) em vez da variável CRLF.
 - Tabelas fixas nas queries.
 - Schema (banco de dados) fixo na query. 

![Análise de Fontes](images/analiseFontes.png?raw=true "Análise de Fontes")

## ANÁLISE DE TAGS
Essa funcionalidade faz uma análise de todas as tags com padrão N.N.N gravando em um arquivo na raiz do projeto a quantidade de críticas em cada tag.

![Análise de TAGS](images/analiseTags.png?raw=true "Análise de TAGS")

# GIT
## BRANCHES
 * **Merge para Teste** Branch de Teste é uma branch onde todas as features e hotfixes serão enviados para submeter aos primeiros testes.
 * **Merge para Homologação** Branch de Homologação é uma branch onde são enviadas todas as implementações que estão testadas e aprovadas.
 * **Merge para Produção** Branch de Produção é destinada a ser aplicada em ambiente de produção onde sempre se deve taguear a versão a ser aplicada.

## FLUXO
![Fluxo do GIT](images/fluxoGit.png?raw=true "Fluxo do GIT")

# Snippets
Foram montados snippets para facilitar o desenvolvimento de funcionalidades ADVPL.

![Snippets](images/snippets.png?raw=true "Snippets")

1. TReport
 * **tReport1** - Modelo de TReport 1 Sessão.
 * **tReport2** - Modelo de TReport 2 Sessões.
 * **tReport3** - Modelo de TReport 3 Sessões.
 * **tReport4** - Modelo de TReport 4 Sessões.
 * **tReport5** - Modelo de TReport 5 Sessões.
 * **tReportTrCell** - Modelo de TRCell para uso nas sessões.
 * **tReportAllParam** - Modelo de adição de parâmetros de impressão. 
 * **pergunta** - Modelo de PutSx1 para geraçãod e parâmetros para o relatório.

2. WebServices
 * **WebService** - Estrutura base do Fonte para WebServices.
 * **WsMethodDec** - Estrutura de declaração de método.
 * **WsMethod** - Estrutura do método.
 * **WsD__** - Estrutura de declaração de WsData.
 * **WSStruct** - Estrutura de Array para o WsData tipo Array.

3. WebServices REST
 * **WebServiceREST** - Estrutura base do Fonte para WebServices REST.
 * **WsMethodGetREST** - Estrutura do método GET para WebServices REST.
 * **WsMethodPostREST** - Estrutura do método POST para WebServices REST.
 * **WsMethodPutREST** - Estrutura do método PUT para WebServices REST.
 * **WsMethodDeleteREST** - Estrutura do método DELETE para WebServices REST.
 * **WsResponseTrueREST** - Retorno positivo para a operação para WebServices REST.
 * **WsResponseFalseREST** - Retorno negativo para a operação para WebServices REST.

## Release Notes

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

### 0.5.5  - 2018-11-19
- Ajuste de espaço na identificação de ProtheusDoc.

### 0.5.4  - 2018-10-31
- Finalização de internacionalização para inglês, troca de mensagens padrão para inglês.

### 0.5.3  - 2018-10-31
- Inicio de internacionalização para inglês.
- Ajustes de identificação de função.

### 0.5.2  - 2018-10-27
- Correção de Internacionalização na descrição, de forma paleativa.

### 0.5.0  - 2018-10-27
- Implementação de Internacionalização.

### 0.4.9  - 2018-10-24
- Melhoria na identificação de Includes.
- Adição de análise de APWEB.CH.

### 0.4.8  - 2018-10-24
- Melhoria na identificação de falta de BeginSql.
- Melhoria na identificação de ConOut().
- Ajuste de Expressões para utilizar de forma mais otimizada.
- Padronização de comentários em snippets.

### 0.4.7  - 2018-10-23
- Correção de tratamento de comentários.

### 0.4.6  - 2018-10-23
- Identificação de Array.ch.

### 0.4.5  - 2018-10-23
- Análise de expressões de includes somente com o texto sem comentários e strings.
- Análise de Includes contidos em outros.
- Simplificação de expressões de Includes.
- Análise de Parâmetro MV_FOLMES e MSGBOX que foram descontinuados para o Protheus 12.
- Correção de bug de identificação de classe fix #1.

### 0.4.4  - 2018-10-22
- Correção de identificação de funções.

### 0.4.3  - 2018-10-22
- Inclusão de includes obsoletos - STDWIN, SET.

### 0.4.2  - 2018-10-21
- Inclusão de icone de extensão e melhoria de padrões de README.

### 0.4.1  - 2018-10-21
- Ajuste de identificação de includes FWMVCDEF.CH e REPORT.CH.
- Ajuste de exibição de erros em todas as linhas quando faltar o include.
- Melhoria de identificação de comentários em linhas.

### 0.4.0  - 2018-10-21
- Montagem de objeto de análise de includes.
    -    Analisados - TOPCONN, TBICONN, REPORT, AP5MAIL, APWIZARD, FILEIO, TBICODE, PARMTYPE, FWMVCDEF, AARRAY, RPTDEF, 
                 FWPRINTSETUP, APWEBSRV, APWEBEX e MSOLE.
    - Obsoletos - PROTHEUS, DIALOG, FONT, PTMENU, PRINT, COLORS, FOLDER, MSOBJECT, VKEY, WINAPI, FWCOMMAND e FWCSS.

### 0.3.7  - 2018-10-19
- Crítica de RWMAKE.CH, REPORT.CH obsoleto.

### 0.3.6  - 2018-10-19
- Correção de erro de identificação de PROTHEUS.CH.

### 0.3.5  - 2018-10-19
- Crítica de PROTHEUS.CH obsoleto.

### 0.3.4  - 2018-10-19
- Análise de TBICONN.CH sem PREPARE ENVIRONMENT.
- Análise de PREPARE ENVIRONMENT sem TBICONN.CH.
- Análise de includes duplicados.

### 0.3.3  - 2018-10-18
- Correção de mensagens dadas quando for executar TcSqlExec.

### 0.3.2  - 2018-10-18
- Correção de mensagem na análise de projeto.

### 0.3.1  - 2018-10-17
- Tratamentos de erros na extensão.
- Ajuste de mensagem de MERGE.

### 0.3.0  - 2018-10-17
- Mudança de execução de rotinas de forma síncrona.

### 0.2.1  - 2018-10-16
- Ajuste de identificação de tabela fixas.

### 0.2.0  - 2018-10-16
- Criação de análise de tags, onde serão varridas as tags do padrão N.N.N e gerado um arquivo na raiz com as pendências de cada TAG.
- Melhorada a identificação de tabelas fixas em queries.

### 0.1.1  - 2018-10-10
- Melhoria na identificação UPDATE, SELECT, JOIN e DELETE na mesma linha.

### 0.1.0  - 2018-10-10
- Melhoria na identificação de comentários.

### 0.0.9  - 2018-10-08
- Executa as validações de projeto quando chama as rotinas do GIT.

### 0.0.8  - 2018-10-08
- Correção do Fluxo de merge para a Master.
- Criticas de DELETE FROM.
- Criticas de Erro de Commit.

### 0.0.7  - 2018-10-06
- Montagem de settings para padrão de comentário de fonte.

### 0.0.6  - 2018-10-05
- Implementação para aceitar vários bancos de dados.
- Ajuste para identificação no Settings de configurações de extensão.
- Segregação de classes de Merge e de Validação.
- Melhoria de identificação de banco de dados fixo no fonte.
- Recomendação de identação de queryes para melhor análise.

### 0.0.5  - 2018-10-05
- Alteração de classificações de mensagens de Error para Warning.
- Criação de regra para verificar tabelas fixas em query.

### 0.0.4  - 2018-10-05
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
- Ajuste de validação que Select com *.
- Alert para utilização de CRLF em vez de funções.

### 0.0.1 - 2018-10-04
- Foi implementada a Validação de fontes básica e os merges.

# Código
[Github](https://github.com/robsonrosilva/advpl-sintaxe)

** Enjoy!**