import React from 'react';
import { Phone, MapPin, Mail, Heart, ShieldCheck, Sparkles, Globe, Camera, Map } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Banner Giới Thiệu */}
      <div className="bg-pink-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Về <span className="text-pink-600">HoaViet</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Nơi tình yêu và những thông điệp chân thành được gửi gắm qua từng đóa hoa tươi thắm nhất.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12">
          
          {/* Sứ mệnh & Giá trị */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Heart className="text-pink-500" /> Câu Chuyện Của Chúng Tôi
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Khởi nguồn từ tình yêu với cái đẹp và mong muốn mang lại niềm vui cho mọi người, <strong>HoaViet</strong> được ra đời với sứ mệnh trở thành cầu nối cảm xúc. Chúng tôi tin rằng mỗi đóa hoa đều mang một ngôn ngữ riêng, có sức mạnh xoa dịu tâm hồn và gắn kết những yêu thương.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Tại HoaViet, từng cành hoa đều được tuyển chọn kỹ lưỡng mỗi ngày từ những nhà vườn uy tín nhất, đảm bảo độ tươi mới và rực rỡ khi đến tay người nhận.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100">
                <Sparkles className="text-pink-500 mb-3" size={32} />
                <h3 className="font-bold text-gray-800 mb-2">Thiết kế sáng tạo</h3>
                <p className="text-sm text-gray-600">Luôn cập nhật những xu hướng cắm hoa hiện đại và tinh tế nhất.</p>
              </div>
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <ShieldCheck className="text-blue-500 mb-3" size={32} />
                <h3 className="font-bold text-gray-800 mb-2">Cam kết chất lượng</h3>
                <p className="text-sm text-gray-600">Hoa tươi 100%, hoàn tiền nếu sản phẩm không đúng như hình ảnh minh họa.</p>
              </div>
            </div>
          </div>

          <hr className="border-gray-100 mb-16" />

          {/* Thông tin Liên hệ & Bản đồ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Cột Liên Hệ */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <MapPin className="text-pink-500" /> Thông Tin Liên Hệ
              </h2>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center text-pink-600 flex-shrink-0">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Hotline / Zalo</p>
                    <a href="tel:0343290358" className="text-pink-600 font-bold hover:underline text-xl">0343 290 358</a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 flex-shrink-0">
                    <Globe size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Facebook cá nhân</p>
                    <a 
                      href="https://www.facebook.com/long.vuduong.0907" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600 hover:text-blue-600 hover:underline break-all"
                    >
                      Vũ Dương Long 
                    </a>
                  </div>
                </li>

                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 flex-shrink-0">
                    <Camera size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Instagram</p>
                    <a 
                      href="https://www.instagram.com/duowgz_lowg?fbclid=IwY2xjawUTp1NwZG9mBWV4dG4DYWVtAjEwAGJyaWQRMXE1SnFIRXVXWmxuZmtHemRzcnRjBmFwcF9pZBAyMjIwMzkxNzg4MjAwODkyAAEerq465oapB6TAQr3eLFR7tx4rAgqkWKgX3E2n6zX7Y8ElaOr7Xnc8lvXfUds_aem_-YvyXVVdnXTsLYLtuI6zGw" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-600 hover:text-purple-600 hover:underline break-all"
                    >
                      @duowgz_lowg
                    </a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 flex-shrink-0">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 text-lg">Email hỗ trợ</p>
                    <p className="text-gray-600">contact.hoaviet@gmail.com</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* ĐÃ THAY ĐỔI: Chuyển thành Giao diện Bản đồ */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xl h-full flex flex-col relative overflow-hidden">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-gray-800">
                <Map className="text-pink-500" size={28} /> Bản Đồ Cửa Hàng
              </h2>
              
              {/* Khung nhúng bản đồ trực tiếp */}
              <div className="flex-1 w-full rounded-2xl overflow-hidden border border-gray-200 mb-6 min-h-[250px] bg-gray-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.4602324211!2d106.665213715334!3d10.776019592321!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTDCsDQ2JzMzLjciTiAxMDbCsDM5JzU0LjgiRQ!5e0!3m2!1svi!2s!4v1633000000000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Bản đồ HoaViet"
                ></iframe>
              </div>

              {/* Nút link ra bản đồ bạn cung cấp */}
              <a
                href="https://maps.app.goo.gl/2XGPd791QTqPyD3H9"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-pink-500 text-white font-bold py-4 rounded-xl hover:bg-pink-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <MapPin size={20} /> Mở trên ứng dụng Google Maps
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default About;