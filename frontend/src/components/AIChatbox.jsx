import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User as UserIcon } from 'lucide-react';

const AIChatbox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'ai', text: 'Chào bạn! Mình là trợ lý ảo của HoaViet. Bạn cần tư vấn chọn hoa cho dịp gì nhỉ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { sender: 'user', text: userMessage }]);
    setInput('');
    setIsLoading(true);

    try {
      const rawApiKey = import.meta.env.VITE_GEMINI_API_KEY;

      if (!rawApiKey) {
        setMessages(prev => [
          ...prev,
          {
            sender: 'ai',
            text: 'LỖI: Chưa tìm thấy VITE_GEMINI_API_KEY. Vui lòng kiểm tra file .env trong thư mục frontend và khởi động lại npm.'
          }
        ]);
        setIsLoading(false);
        return;
      }

      const cleanApiKey = rawApiKey.trim();
      const model = 'gemini-3.5-flash'; 
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${cleanApiKey}`;

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Bạn là nhân viên tư vấn bán hoa nhiệt tình của tiệm HoaViet.

Hãy tư vấn cho khách hàng về:
- Hoa phù hợp với từng dịp
- Ý nghĩa của các loại hoa
- Cách chọn hoa theo đối tượng
- Cách bảo quản hoa
- Giá hoa nếu khách hỏi thì hãy nói rằng khách có thể xem giá trực tiếp trên website

Quy tắc:
- Trả lời bằng tiếng Việt.
- Ngắn gọn, dễ hiểu.
- Thân thiện, lịch sự.
- Không trả lời quá dài.
- Nếu câu hỏi không liên quan đến hoa hoặc cửa hàng, hãy lịch sự hướng khách quay lại chủ đề.
- QUAN TRỌNG: Bất cứ khi nào nhắc đến tên một loại hoa hoặc sản phẩm cụ thể, HÃY BỌC CHÚNG TRONG CẶP DẤU SAO KÉP (ví dụ: **Hoa Hồng Đỏ**, **Chậu Lan Hồ Điệp**).

Câu hỏi của khách hàng:
${userMessage}`
                }
              ]
            }
          ]
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error('Chi tiết lỗi từ Google:', data);
        throw new Error(data.error?.message || `Lỗi kết nối HTTP ${response.status}`);
      }

      const aiReply = data?.candidates?.[0]?.content?.parts
        ?.map(part => part.text || '')
        .join('')
        .trim();

      if (!aiReply) {
        throw new Error('Google không trả về nội dung phản hồi.');
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: aiReply
        }
      ]);

    } catch (error) {
      console.error('Lỗi chi tiết:', error);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `LỖI: ${error.message}`
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Hàm biến đổi văn bản: Quét dấu ** để in đậm và tô màu hồng
  const formatMessage = (text) => {
    if (!text) return null;
    
    // 1. Tách theo từng dòng (xuống dòng)
    return text.split('\n').map((line, lineIndex) => {
      // 2. Quét tìm cụm từ được bọc bởi **...**
      const parts = line.split(/(\*\*.*?\*\*)/g);
      
      return (
        <div key={lineIndex} className="min-h-[1.25rem]">
          {parts.map((part, index) => {
            // Nếu đoạn chữ bắt đầu và kết thúc bằng **, ta lột bỏ nó đi và thay bằng thẻ <strong> màu hồng
            if (part.startsWith('**') && part.endsWith('**')) {
              return (
                <strong key={index} className="text-pink-600 font-bold">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            // Những chữ bình thường thì giữ nguyên
            return <span key={index}>{part}</span>;
          })}
        </div>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white p-4 rounded-full shadow-2xl transition-transform transform hover:scale-110 flex items-center justify-center animate-bounce"
        >
          <MessageCircle size={32} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white w-80 sm:w-96 rounded-2xl shadow-2xl border border-pink-100 flex flex-col overflow-hidden animate-fade-in-up" style={{ height: '500px' }}>
          <div className="bg-gradient-to-r from-pink-500 to-pink-400 p-4 flex justify-between items-center text-white shadow-md">
            <div className="flex items-center gap-2">
              <Bot size={24} />
              <span className="font-bold text-lg">Trợ lý ảo HoaViet</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-pink-200 transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`flex items-start gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100 text-blue-600' : 'bg-pink-100 text-pink-600'}`}>
                    {msg.sender === 'user' ? <UserIcon size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-white border border-gray-100 text-gray-700 rounded-tl-none shadow-sm'}`}>
                    
                    {/* ĐÃ NÂNG CẤP: Gọi hàm định dạng chữ cho tin nhắn của AI */}
                    {msg.sender === 'user' ? msg.text : formatMessage(msg.text)}

                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                  <span className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi..." 
                className="flex-1 border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-pink-500"
              />
              <button 
                type="submit" 
                disabled={isLoading || !input.trim()}
                className="bg-pink-500 text-white p-2 rounded-full hover:bg-pink-600 transition-colors disabled:bg-gray-300"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChatbox;