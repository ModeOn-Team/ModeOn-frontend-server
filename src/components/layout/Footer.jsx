const Footer = () => {
  return (
    <footer className="w-full bg-black text-gray-300 py-8 mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-3 gap-16">
        <div>
          <h2 className="text-xl font-bold text-white mb-3">ModeOn</h2>
          <p className="text-sm text-gray-400 leading-6">
            패션을 쉽고 빠르게.  
            ModeOn은 스타일과 편리함을 함께 제공합니다.
          </p>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li>
              <a href="/" className="hover:text-white transition-colors">고객센터</a>
            </li>
            <li>
              <a href="/" className="hover:text-white transition-colors">이용약관</a>
            </li>
            <li>
              <a href="/" className="hover:text-white transition-colors">개인정보처리방침</a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-white text-lg font-semibold mb-3">Contact</h3>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>이메일: modeon@modeon.com</li>
            <li>전화: 02-1234-5678</li>
            <li>주소: modeon</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 mt-8 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ModeOn. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
