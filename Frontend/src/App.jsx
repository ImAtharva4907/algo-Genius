import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Brain, Code, FileText } from "lucide-react"
import axios from "axios"
import { Editor } from "@monaco-editor/react"
import rehypeHighlight from "rehype-highlight"
import "highlight.js/styles/github-dark.css"
import ReactMarkdown from "react-markdown"
import { Resizable } from "re-resizable"
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa"

export default function AlgoReview() {
  const defaultCodes = {
    cpp: '// Write your C++ code here\n#include<iostream>\nusing namespace std;\nint main() {\n    cout << "Hello, World!" << endl;\n    return 0;\n}',
    python: '# Write your Python code here\nprint("Hello, World!")',
    java: '// Write your Java code here\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}',
    javascript: "// Write your JavaScript code here\nconsole.log('Hello, World!');",
  }
  const nullReview = "Write your code in the editor to review it!💡"

  const [code, setCode] = useState(defaultCodes.cpp)
  const [review, setReview] = useState(nullReview)
  const [editorWidth, setEditorWidth] = useState("50%")
  const [language, setLanguage] = useState("cpp")
  const [isMobile, setIsMobile] = useState(false)
  const [showEditor, setShowEditor] = useState(true)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleLanguageChange = (e) => {
    const newLanguage = e.target.value
    setLanguage(newLanguage)
    setCode(defaultCodes[newLanguage])
    setReview(nullReview)
  }

  async function reviewCode() {
    try {
      const response = await axios.post("https://akgo-genius.onrender.com/ai/get-review", {
        code,
      })
      setReview(response.data || "Error: No review received.")
      if (isMobile) setShowEditor(false)
    } catch (error) {
      setReview("Error fetching review. Please try again.")
      console.error("Review error:", error)
    }
  }

  return (
    <div className="bg-[#0d1117] text-[#c9d1d9] min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-3 py-2 bg-[#161b22] text-white">
        <div className="flex items-center gap-1">
          <Brain size={35} className="text-[#58a6ff]" />
          <h1 className="text-2xl md:text-4xl font-bold"> algoGenius.</h1>
        </div>
        {isMobile && (
          <Button
            className="bg-[#238636] text-white p-2 rounded-lg shadow-lg hover:bg-[#2ea043]"
            onClick={() => setShowEditor(!showEditor)}
          >
            {showEditor ? <FileText size={20} /> : <Code size={20} />}
          </Button>
        )}
      </nav>

      {/* Main Layout */}
      <div className="flex flex-grow gap-0 p-1 relative h-[calc(100vh-50px)] pb-4">
        {(!isMobile || showEditor) && (
          <Resizable
            defaultSize={{ width: isMobile ? "100%" : editorWidth, height: "100%" }}
            minWidth={isMobile ? "100%" : "30%"}
            maxWidth={isMobile ? "100%" : "70%"}
            enable={{ right: !isMobile }}
            handleClasses={{ right: "resize-handle" }}
            onResizeStop={(e, direction, ref) => setEditorWidth(ref.style.width)}
          >
            <Card className="p-3 bg-[#161b22] border border-[#30363d] relative h-full flex flex-col">
              {/* Language Selector */}
              <div className="flex justify-between items-center mb-2">
                <select
                  className="bg-[#238636] text-white px-2 py-1 rounded shadow-lg text-xs hover:bg-[#2ea043]"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  <option value="cpp">C++</option>
                  <option value="python">Python</option>
                  <option value="java">Java</option>
                  <option value="javascript">Javascript</option>
                </select>
              </div>

              {/* Code Editor Container */}
              <div className="flex-grow rounded-lg overflow-hidden border border-[#30363d]">
                <Editor
                  value={code}
                  onChange={(newValue) => setCode(newValue)}
                  height="95%"
                  options={{ fontSize: 15 }}
                  language={language}
                  theme="vs-dark"
                />
              </div>

              {/* Review Button */}
              <Button
                className="absolute bottom-3 right-3 bg-[#238636] text-white p-2 rounded-lg shadow-lg hover:bg-[#2ea043] z-[10]"
                onClick={reviewCode}
              >
                Get Review 🚀
              </Button>
            </Card>
          </Resizable>
        )}

        {(!isMobile || !showEditor) && (
          <div className={`w-full ${isMobile ? "" : "border-l-2 border-[#30363d]"} overflow-auto`}>
            <Card className="p-3 bg-[#161b22] border border-[#30363d] h-full">
              <div className="p-3 border rounded-md bg-[#262626] text-[#c9d1d9] h-full overflow-auto">
                <ReactMarkdown rehypePlugins={[rehypeHighlight]}>{review}</ReactMarkdown>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Socials Added */}
      <div className="p-4 md:p-10 text-center bg-[#041117]">
        <p className="text-sm md:text-base">Made with ❤️ by Atharva Chauhan</p>
        <div className="flex justify-center space-x-4 md:space-x-6 mt-2 md:mt-4">
          <a href="https://github.com/ImAtharva4907" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <FaGithub className="text-white hover:text-gray-400" size={24} />
          </a>
          <a
            href="https://www.linkedin.com/in/imatharva"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-white hover:text-gray-400" size={24} />
          </a>
          <a
            href="https://www.instagram.com/real_atharvaa"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <FaInstagram className="text-white hover:text-gray-400" size={24} />
          </a>
        </div>
      </div>
    </div>
  )
}

