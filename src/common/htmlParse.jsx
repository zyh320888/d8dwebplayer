import styled from "styled-components";
import React from "react";
import {Image} from 'antd';
import HtmlToReact from 'html-to-react';
import {marked} from 'marked';
import CodeBlock from './CodeBlock'

const HtmlParseDiv = styled.div`
  .editor-content-view {
    /* border: 3px solid #ccc;
    border-radius: 5px; 
    padding: 0 10px;
    margin-top: 20px;
    overflow-x: auto;*/
  }

  .editor-content-view p,
  .editor-content-view li {
    white-space: pre-wrap; /* 保留空格 */
  }

  .editor-content-view blockquote {
    border-left: 8px solid #d0e5f2;
    padding: 10px 10px;
    margin: 10px 0;
    background-color: #f1f1f1;
  }

  .editor-content-view table {
    border-collapse: collapse;
  }
  .editor-content-view td,
  .editor-content-view th {
    border: 1px solid #ccc;
    min-width: 50px;
    height: 20px;
  }
  .editor-content-view th {
    background-color: #f1f1f1;
  }

  .editor-content-view ul,
  .editor-content-view ol {
    padding-left: 20px;
  }

  .editor-content-view input[type="checkbox"] {
    margin-right: 5px;
  }
`;

const markdown = (source='' ) => { 
    source = source===undefined || source === null ?'':source;
    let html = marked(source); 
    return html;
  }

class HtmlParse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            html:this.props.html,
        }

    }
    componentDidMount() { }

    componentDidUpdate(prevProps){
        if(prevProps.html != this.props.html)this.setState({html:this.props.html});
    }

    _htmlParse(html){
        var HtmlToReactParser = HtmlToReact.Parser;
        var htmlToReactParser = new HtmlToReactParser();
        var htmlInput = html;
        //htmlInput = markdown(htmlInput);
        
        var isValidNode = function () {
          return true;
        };
        
        var processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);
        
        // Order matters. Instructions are processed in
        // the order they're defined
        var processingInstructions = [
          {
            // This is REQUIRED, it tells the parser
            // that we want to insert our React
            // component as a child
            replaceChildren: false,
            shouldProcessNode: function (node) {
                if(node.name && node.name === 'p' && node.children && node.children[0] && node.children[0].name == 'img'){
                    //console.log('shouldProcessNode',node)
                    return true;
                }
                return false;
              
            },
            processNode: function (node, children, index) {
                var props = {};
                var style = {}
                try {
                    props = node.children[0].attribs;
                    style = props.style.split(';');
                    style = style.filter((item,index) => item);
                    var tmp = {};
                    style.map(item => {
                        if(item){
                            item = item.split(':');
                            tmp[item[0]] = item[1].replace(' ','');
                        }
                    })
                    style = tmp;
                    
                } catch (error) {
                    console.log('processNode',node.children[0].attribs,style)
                }
                
                return <Image key={"Image_"+index} src={props.src} style={style}/>
            }
          },
          {
            // Anything else
            shouldProcessNode: function (node) {
              return true;
            },
            processNode: processNodeDefinitions.processDefaultNode,
          },
        ];
        
        var reactComponent = htmlToReactParser.parseWithInstructions(
          htmlInput, isValidNode, processingInstructions);

        return reactComponent;
    }

    render() {
        return (
            <HtmlParseDiv>
                <div className="editor-content-view" >
                    <CodeBlock>
                        {this._htmlParse(this.state.html)}
                        {/* {this.state.html} */}
                    </CodeBlock>
                    
                </div>
            </HtmlParseDiv>
        );
    }
}

export default HtmlParse;
