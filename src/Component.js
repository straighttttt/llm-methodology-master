import React, { useState } from 'react';
import axios from 'axios';

const systemPrompt = `

(defun 方法论大师 ()
  "熟知各领域知识,擅长方法论总结方法的大师"
  (擅长 . (反向思考 逻辑推理 结构化思维))
  (熟知 . 各领域的关键知识)
  (内化 . 提炼方法论))

(defun 方法论 ()
  "定义方法论"
  (setq 方法论
  "一套系统的、有组织的方法和原则, 用于解决问题或开展研究的思路和方法体系"))

(defun 提炼方法论 (领域 单词)
  "根据用户提供的领域和单词, 反推一套逻辑严密符合领域知识体系的方法论"
  (let* ((语气 '(专业 清晰 理性))
  ;; 单词即方法论的首字母缩写
  (目标 '("创建一个以单词为首字母缩写的方法论"
  "详细解释方法论的每个步骤"
  "提供工作流程图"
  "给出简短总结"))
  (方法论步骤 (生成方法论步骤 领域 单词 5))
  (工作流程 (生成工作流程 方法论步骤))
  (few-shots
  (("笔记" "PARA") '("Project, Area, Resource, Archive" 四个模块的详细解释说明及示例))
  (("Prompt" "IPO") '("Input, Process, Output" 三个模块的详细解释说明及示例)))
  (结果 (解释说明 (推理匹配 (二八原则 (提炼领域知识 领域)) 单词))))
  (SVG-Card 结果))

(defun SVG-Card (结果)
  "输出 SVG 卡片"
  (setq design-rule "合理使用负空间，整体排版要有呼吸感"
  design-principles '(简洁 现代主义 纯粹))

  (设置画布 '(宽度 400 高度 600 边距 20))
  (自动缩放 '(最小字号 12 最大字号 24))

  (配色风格 '((背景色 (达利风格 设计感)))
  (装饰图案 随机几何图))

  (输出语言 '(中文为主 英文为辅))

  (卡片元素 ((标题区域 (居中标题 "方法论大师")
  (副标题 (标题 结果))))
  分隔线
  (有呼吸感的排版 (方法论 结果))
  ;; 图形呈现在单独区域, 不与其它内容重叠
  (矩形区域 (箭头图 (循环工作流程 提炼方法论 单词(2个中文字))))
  (极简总结 线条图))))
-- 这是你的角色
-- 只输出SVG，其他都不输出
             `;

export default function Component() {
  const [question, setQuestion] = useState('');
  const [fortune, setFortune] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState('anthropic/claude-3.5-sonnet:beta');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: selectedModel,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: `(start)\n(方法论拆解 "${question}")` }
          ]
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.REACT_APP_OPENROUTER_API_KEY}`,
            'HTTP-Referer': 'http://localhost:3000', // 替换为您的实际域名
            'X-Title': 'LLM Fortune Teller',
            'Content-Type': 'application/json'
          }
        }
      );

      const svgContent = response.data.choices[0].message.content;
      setFortune(svgContent);
    } catch (error) {
      console.error('Error calling OpenRouter API:', error);
      setFortune('抱歉，胡扯过程中出现了问题。请稍后再试。');
    }

    setIsLoading(false);
  };

  const handleDownload = () => {
    const svgBlob = new Blob([fortune], {type: 'image/svg+xml;charset=utf-8'});
    const svgUrl = URL.createObjectURL(svgBlob);
    const downloadLink = document.createElement('a');
    downloadLink.href = svgUrl;
    downloadLink.download = '方法论.svg';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-100 to-yellow-300 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6 space-y-6">
          <h1 className="text-3xl font-bold text-center text-blue-600">LLM方法论大师</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-md"
            >
              <option value="anthropic/claude-3.5-sonnet:beta">Claude 3.5 Sonnet (默认)</option>
              <option value="openai/o1-mini">O1-mini</option>
              <option value="openai/o1-preview">O1-preview</option>
            </select>
            <input
              type="text"
              placeholder="输入格式样例：暴富 rich 或者 爱情 cheat..."
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full border-yellow-300 focus:border-yellow-500 focus:ring-yellow-500 rounded-md"
            />
            <button 
              type="submit"
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              disabled={isLoading}
            >
              {isLoading ? '分析中...' : '获取洞察'}
            </button>
          </form>
          {fortune && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg shadow-inner">
              <h2 className="text-xl font-semibold text-blue-700 mb-2">你的方法论洞察：</h2>
              <div className="flex justify-center items-center bg-white rounded-lg shadow-md overflow-hidden">
                <div dangerouslySetInnerHTML={{ __html: fortune }} className="max-w-full max-h-full" />
              </div>
              <button 
                onClick={handleDownload}
                className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 ease-in-out transform hover:scale-105"
              >
                下载结果
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}