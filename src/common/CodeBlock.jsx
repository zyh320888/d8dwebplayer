import React, { useState } from "react";
import { Button } from "antd";
import copy from "copy-to-clipboard";
import hljs from "highlight.js";
//import "highlight.js/styles/atom-one-dark.css";
import styled from "styled-components";

const HighlightDiv = styled.div`
  pre code.hljs{display:block;overflow-x:auto;padding:1em}code.hljs{padding:3px 5px}.hljs{background:#1e1e1e;color:#dcdcdc}.hljs-keyword,.hljs-literal,.hljs-name,.hljs-symbol{color:#569cd6}.hljs-link{color:#569cd6;text-decoration:underline}.hljs-built_in,.hljs-type{color:#4ec9b0}.hljs-class,.hljs-number{color:#b8d7a3}.hljs-meta .hljs-string,.hljs-string{color:#d69d85}.hljs-regexp,.hljs-template-tag{color:#9a5334}.hljs-formula,.hljs-function,.hljs-params,.hljs-subst,.hljs-title{color:#dcdcdc}.hljs-comment,.hljs-quote{color:#57a64a;font-style:italic}.hljs-doctag{color:#608b4e}.hljs-meta,.hljs-meta .hljs-keyword,.hljs-tag{color:#9b9b9b}.hljs-template-variable,.hljs-variable{color:#bd63c5}.hljs-attr,.hljs-attribute{color:#9cdcfe}.hljs-section{color:gold}.hljs-emphasis{font-style:italic}.hljs-strong{font-weight:700}.hljs-bullet,.hljs-selector-attr,.hljs-selector-class,.hljs-selector-id,.hljs-selector-pseudo,.hljs-selector-tag{color:#d7ba7d}.hljs-addition{background-color:#144212;display:inline-block;width:100%}.hljs-deletion{background-color:#600;display:inline-block;width:100%}
`;


function CodeBlock(props) {
    const [copied, setCopied] = useState({});

    const copyToClipboard = (text, buttonKey) => {
        copy(text);
        let tmpCopied = { ...copied };
        tmpCopied[buttonKey] = true;
        setCopied(tmpCopied);
        setTimeout(() => {
            tmpCopied[buttonKey] = false;
            setCopied({...tmpCopied});
        }, 1000);
    };

    const preCodeElements = React.Children.toArray(props.children);

    const preCodeElementsWithCopyButton = preCodeElements.map((element, index) => {
        if (element.type === "pre" && element.props.children.type === "code") {

            //console.log('preCodeElements', element.props.children)
            let buttonKey = "button-" + index;
            let copyText = element.props.children.props.children;
            let codeClassName = element.props.children.props.className;
            let highlightedCode = '';
            try {
                highlightedCode = hljs.highlightAuto(copyText).value;
            } catch (error) {
                console.log('preCodeElements.copyText', copyText)
            }

            let codeLines = highlightedCode.split("\n");
            let codeWithLineNumbers = codeLines.map((line, index) => {
                return (
                    <div key={index} style={{ display: "flex" }}>
                        <div style={{ paddingRight: "10px", color: "grey", userSelect: "none" }}>{index + 1}</div>
                        <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: line }}></div>
                    </div>
                );
            });
            return (
                <div key={index} style={{}}>
                    <pre style={{ margin: 0, overflowX: "auto" }}>
                        <code style={{ display: "inline-block", position: "relative" }} className={codeClassName + ' hljs'}
                        >
                            {codeWithLineNumbers}
                            <Button
                                size="small"
                                type="text"
                                onClick={() => copyToClipboard(copyText, buttonKey)}
                                key={buttonKey}
                                style={{ position: "absolute", top: -5, right: 0, color: '#FFF' }}
                                disabled={copied[buttonKey]}
                            >
                                {copied[buttonKey] ? "已复制" : "复制代码"}
                            </Button>
                        </code>
                    </pre>

                </div>
            );
        } else {
            return element;
        }
    });

    //return <div>{preCodeElementsWithCopyButton}</div>;
    return <HighlightDiv>{preCodeElementsWithCopyButton}</HighlightDiv>;
}

export default CodeBlock;