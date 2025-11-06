
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { FaUserCircle } from 'react-icons/fa'

function Bot() {
    const [messages,setMessages]=useState([])
    const [input,setInput]=useState("")
    const [loading,setLoading]=useState(false)
    const messagesEndRef=useRef(null)

    useEffect(()=>{
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    },[messages])

    const handleSendMessage = async () => {
        setLoading(true);
        if(!input.trim()) return;
        try {
           const res=await axios.post("http://localhost:4002/bot/v1/message",{
                text: input
            })
            if(res.status === 200) {
                setMessages([...messages, { text: res.data.userMessage, sender: 'user' }, { text: res.data.botMessage, sender: 'bot' }]);
               
            }
            console.log(res.data)
        } catch (error) {
            console.log("Error sending message:", error);
        }
         setInput("");
            setLoading(false);
    }

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') handleSendMessage()}
            
  return (
   <div className="flex flex-col min-h-screen bg-gradient-to-tr from-[#f13ce5] via-[#e08ee9] to-[#ecb7e5] text-white">

     <header className="fixed top-0 left-0 w-full bg-gradient-to-r from-[#0f0f0f] via-[#ef91f9] to-[#ecb7e5] border-b border-gray-800 shadow-md z-10">
  <div className="container mx-auto flex justify-between items-center px-6 py-4">
    <h1 className="text-3xl font-bold text-white tracking-widest drop-shadow-[0_0_10px_#ecb7e5]">
      LUNA
    </h1>
    <FaUserCircle size={30} className="cursor-pointer text-white hover:text-[#000000] transition-colors duration-300" />
  </div>
</header>





      {/* Chat area */}
     <main className="flex-1 overflow-y-auto pt-20 pb-24 flex items-center justify-center">
  <div className="w-full max-w-4xl mx-auto px-4 flex flex-col space-y-3">
    {messages.length === 0 ? (
      <div className="text-center text-green-800 text-4xl"> {/* Changed from text-lg to text-3xl */}
        🚀 Hi, I'm{" "}
        <span className="text-purple-900 font-semibold">
          <span className="inline-block h-[1.2em] overflow-hidden align-top">
            <span className="flex flex-col items-start animate-slide">
              <span className="h-[1.2em] leading-[1.2em]">LUNA</span>
              <span className="h-[1.2em] leading-[1.2em]">AI</span>
              <span className="h-[1.2em] leading-[1.2em]">LUNA</span>
            </span>
          </span>
        </span>
        
      </div>
          ) : (
            <>
              {messages.map((msg, idx) => (
               <div
  key={idx}
  className={`px-4 py-2 rounded-xl max-w-[75%] glass-shadow ${
    msg.sender === "user"
      ? "bg-blue-600/80 text-white self-end"
      : "bg-gray-800/60 text-gray-100 self-start"
  }`}
>
  {msg.text}
</div>
              ))}

              {loading && (
                <div className="bg-gray-700 text-gray-300 px-4 py-2 rounded-xl max-w-[60%] self-start">
                  Bot is typing...
                </div>
              )}
           <div ref={messagesEndRef}/>
            </>
          )}
        </div>
      </main>

      {/* Input & Footer */}
      <footer className="fixed bottom-0 left-0 w-full ">
  <div className="max-w-4xl mx-auto flex justify-center px-4 py-3">
    <div className="w-full flex bg-gray-900 rounded-full px-4 py-2 shadow-lg">
      <input
        type="text"
        className="flex-1 bg-transparent outline-none text-white placeholder-gray-400 px-2"
        placeholder="Ask me anything..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <button
        onClick={handleSendMessage}
        className="bg-green-600 hover:bg-green-700 px-4 py-1 rounded-full text-white font-medium transition-colors"
      >
        Send
      </button>
    </div>
  </div>
</footer>
    </div>
  )
}

export default Bot