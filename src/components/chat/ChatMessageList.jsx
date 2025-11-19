import { useEffect, useRef } from "react";
import useChatStore from "../../store/chatStore";
import StorageService from "../../services/storage";
import TypingIndicator from "./TypingIndicator";
import { sendTextMessage, sendDeliveryInquiryMessage, sendExchangeReturnMessage } from "../../services/chatApi";

// 채팅 메시지 리스트 컴포넌트
// 메시지 타입별 렌더링 (TEXT, IMAGE, FILE)
const ChatMessageList = ({ roomId }) => {
  const { messages, hasTypingUser, addMessage } = useChatStore();
  const messagesEndRef = useRef(null);
  const containerRef = useRef(null);
  const shouldAutoScrollRef = useRef(true);
  const previousMessagesLengthRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef(null);
  const processedMessagesRef = useRef(new Set()); // 이미 처리한 안내 메시지 ID 추적
  const currentUserId = StorageService.getUser()?.id;

  // roomId를 문자열로 통일하여 메시지 조회
  const stringRoomId = String(roomId);
  const roomMessages = messages[stringRoomId] || [];
  
  // roomId가 변경되면 처리된 메시지 추적 초기화
  useEffect(() => {
    processedMessagesRef.current.clear();
  }, [stringRoomId]);
  
  // 메시지가 완전히 리셋되면 처리된 메시지 추적도 초기화
  useEffect(() => {
    // SYSTEM_BUTTONS 메시지만 있고 다른 메시지가 없으면 리셋된 것으로 간주
    const hasOnlyInitialMessage = roomMessages.length === 1 && 
      roomMessages[0]?.messageType === "SYSTEM_BUTTONS" &&
      roomMessages[0]?.content?.includes("안녕하세요 모드온입니다");
    
    if (hasOnlyInitialMessage) {
      processedMessagesRef.current.clear();
    }
  }, [roomMessages]);
  
  // 안내 메시지가 추가될 때마다 그 아래에 초기 안내 메시지를 자동으로 추가
  // 단, "입고 및 배송 문의" 안내 메시지는 제외 (해당 안내 메시지만 표시)
  useEffect(() => {
    if (!stringRoomId || roomMessages.length === 0) return;
    
    const initialMessageContent = `안녕하세요 모드온입니다 :)\n\n상담 운영시간\n월~금 : 9:00 ~ 18:00\n공휴일 휴무\n\n이 외 궁금하신 사항은 게시판에 남겨주시면 순차적으로 안내해드리겠습니다\n\n궁금한 사항을 선택해주세요`;
    
    // 안내 메시지들을 찾아서 각각의 바로 다음에 초기 안내 메시지가 있는지 확인
    roomMessages.forEach((msg, idx) => {
      // "입고 및 배송 문의" 안내 메시지는 제외 (해당 안내 메시지만 표시)
      const isDeliveryInquiry = msg.content && (
        msg.content.includes("고객님께서 주문하시는 제품은 모두") ||
        msg.content.includes("주문 후 출고까지는 평균 2-3일")
      );
      
      if (isDeliveryInquiry) {
        // "입고 및 배송 문의" 안내 메시지는 초기 안내 메시지를 추가하지 않음
        processedMessagesRef.current.add(msg.id);
        return;
      }
      
      // "교환/반품" 안내 메시지도 제외 (해당 안내 메시지만 표시)
      const isExchangeReturn = msg.content && (
        msg.content.includes("교환/반품 안내") ||
        msg.content.includes("교환 및 반품") ||
        msg.content.includes("반품 및 교환")
      );
      
      if (isExchangeReturn) {
        // "교환/반품" 안내 메시지는 초기 안내 메시지를 추가하지 않음
        processedMessagesRef.current.add(msg.id);
        return;
      }
      
      // "상담원 연결하기" 안내 메시지도 제외 (해당 안내 메시지만 표시)
      const isConsultantConnection = msg.content && (
        msg.content.includes("궁금하신 내용을 남겨주시면 담당자가") ||
        msg.content.includes("상담센터 운영시간") ||
        msg.content.includes("편하게 궁금하신 점 남겨주세요")
      );
      
      if (isConsultantConnection) {
        // "상담원 연결하기" 안내 메시지는 초기 안내 메시지를 추가하지 않음
        processedMessagesRef.current.add(msg.id);
        return;
      }
      
      // "배송전 변경 및 취소" 안내 메시지도 제외 (해당 안내 메시지만 표시)
      const isOrderChangeCancel = msg.content && (
        msg.content.startsWith("배송전 변경 및 취소 안내") ||
        msg.content.includes("주문 변경") ||
        msg.content.includes("주문 취소") ||
        msg.content.includes("환불 안내")
      );
      
      if (isOrderChangeCancel) {
        // "배송전 변경 및 취소" 안내 메시지는 초기 안내 메시지를 추가하지 않음
        processedMessagesRef.current.add(msg.id);
        return;
      }
      
      const isGuidanceMessage = msg.messageType === "SYSTEM";
      
      if (isGuidanceMessage) {
        // 이미 처리한 메시지는 건너뛰기
        if (processedMessagesRef.current.has(msg.id)) {
          return;
        }
        
        // 이 안내 메시지 바로 다음에 초기 안내 메시지가 있는지 확인
        const nextMessage = roomMessages[idx + 1];
        const hasInitialAfter = nextMessage && 
          nextMessage.messageType === "SYSTEM_BUTTONS" && 
          nextMessage.content?.includes("안녕하세요 모드온입니다");
        
        // 초기 안내 메시지가 없으면 추가
        if (!hasInitialAfter) {
          const initialMessage = {
            id: `initial-${msg.id}-${Date.now()}-${idx}`,
            roomId: stringRoomId,
            senderId: null,
            receiverId: null,
            content: initialMessageContent,
            messageType: "SYSTEM_BUTTONS",
            timestamp: new Date(new Date(msg.timestamp).getTime() + 1).toISOString(), // 안내 메시지 바로 다음 시간
            isRead: true,
            sender: "ADMIN",
            userId: null,
            adminId: null,
            metadata: JSON.stringify({
              buttons: [
                "입고 및 배송 문의",
                "배송전 변경 및 취소",
                "교환/반품"
              ]
            }),
          };
          
          addMessage(stringRoomId, initialMessage);
          processedMessagesRef.current.add(msg.id); // 처리 완료 표시
        } else {
          processedMessagesRef.current.add(msg.id); // 이미 초기 메시지가 있으면 처리 완료 표시
        }
      }
    });
  }, [roomMessages, stringRoomId, addMessage]);

  // 스크롤 위치 추적 및 사용자 스크롤 감지
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      // 사용자가 직접 스크롤 중인지 감지
      isUserScrollingRef.current = true;
      
      // 스크롤이 멈춘 후 150ms 후에 자동 스크롤 활성화 여부 결정
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
      
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
        shouldAutoScrollRef.current = isNearBottom;
      }, 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // 초기 로드 시 자동 스크롤 (한 번만)
  useEffect(() => {
    if (roomMessages.length > 0 && previousMessagesLengthRef.current === 0) {
      setTimeout(() => {
        const container = containerRef.current;
        if (container) {
          container.scrollTop = container.scrollHeight;
          shouldAutoScrollRef.current = true;
        }
      }, 200);
    }
    previousMessagesLengthRef.current = roomMessages.length;
  }, [roomMessages.length === 0 ? null : roomMessages.length]);

  // 새 메시지 시 자동 스크롤 (사용자가 맨 아래에 있고 스크롤 중이 아닐 때만)
  useEffect(() => {
    const isNewMessage = roomMessages.length > previousMessagesLengthRef.current;
    
    if (isNewMessage && shouldAutoScrollRef.current && !isUserScrollingRef.current) {
      setTimeout(() => {
        const container = containerRef.current;
        if (container && shouldAutoScrollRef.current) {
          container.scrollTop = container.scrollHeight;
        }
      }, 50);
    }
    
    previousMessagesLengthRef.current = roomMessages.length;
  }, [roomMessages]);

  // 배송전 변경 및 취소 안내 내용 (API 없음)
  const getOrderChangeCancelContent = () => {
    return `배송전 변경 및 취소 안내

주문 변경
주문 후 배송 준비 전까지 옵션 변경 가능
배송 준비 중인 경우 변경 불가
변경 사항: 옵션(사이즈, 색상), 수량, 배송지 주소

주문 취소
배송 준비 전: 즉시 취소 처리 및 환불
배송 준비 중: 취소 요청 시 배송 중단 후 환불
배송 완료 후: 교환/반품 신청으로 진행

환불 안내
결제 취소: 영업일 기준 1-3일 소요
환불 방법: 결제하신 수단으로 자동 환불

주문 변경/취소를 원하시면 주문번호와 함께 요청해주세요.`;
  };

  // 버튼 클릭 핸들러
  const handleButtonClick = async (buttonText) => {
    if (!roomId) {
      alert("채팅방 정보를 불러올 수 없습니다.");
      return;
    }

    const currentUser = StorageService.getUser();
    if (!currentUser?.id) {
      alert("로그인이 필요합니다.");
      return;
    }

    const numericRoomId = Number(roomId);
    if (isNaN(numericRoomId) || numericRoomId <= 0) {
      console.warn("유효하지 않은 roomId:", roomId);
      alert("유효하지 않은 채팅방입니다.");
      return;
    }

    const isAdmin = currentUser?.role === "ROLE_ADMIN";

    try {
      // 1단계: 먼저 사용자가 버튼을 클릭했다는 메시지를 전송 (우측 파란색 박스)
      // 관리자와 일반 사용자 모두 프론트엔드에서 즉시 메시지 추가하여 우측 파란색으로 표시
      const tempMessageId = `temp-user-${buttonText}-${Date.now()}`;
      const userMessage = {
        id: tempMessageId,
        roomId: stringRoomId,
        senderId: currentUser.id,
        receiverId: null,
        content: buttonText,
        messageType: "TEXT",
        timestamp: new Date().toISOString(),
        isRead: false,
        sender: isAdmin ? "ADMIN" : "USER",
        userId: isAdmin ? null : currentUser.id,
        adminId: isAdmin ? currentUser.id : null,
        metadata: null,
      };
      addMessage(stringRoomId, userMessage);
      
      // 백엔드로도 전송 (WebSocket을 통해 다른 사용자에게도 전달)
      // 백엔드에서 받은 메시지가 있으면 임시 메시지를 대체
      try {
        await sendTextMessage({
          roomId: numericRoomId,
          sender: isAdmin ? "ADMIN" : "USER",
          message: buttonText,
          messageType: "TEXT",
          metadata: null,
          userId: isAdmin ? null : currentUser.id,
          adminId: isAdmin ? currentUser.id : null,
        });
        
        // 백엔드에서 받은 메시지로 임시 메시지 대체 (WebSocket을 통해 자동으로 추가됨)
        // 임시 메시지는 WebSocket으로 받은 메시지가 추가되면 중복 체크로 자동 제거됨
      } catch (sendError) {
        // 전송 실패해도 임시 메시지는 유지
        console.error("메시지 전송 실패:", sendError);
      }

      // 2단계: 버튼별 안내 메시지 API 호출
      // 백엔드에서 WebSocket을 통해 자동으로 메시지가 전송되므로 API 호출만 하면 됨
      if (buttonText === "입고 및 배송 문의") {
        try {
          await sendDeliveryInquiryMessage(numericRoomId);
          // WebSocket을 통해 자동으로 메시지가 수신되므로 별도 처리 불필요
        } catch (apiError) {
          console.error("입고 및 배송 문의 API 오류:", apiError);
          
          if (apiError.response?.status === 403) {
            alert(apiError.response?.data?.message || "안내 메시지를 전송할 권한이 없습니다.");
          } else if (apiError.response?.status === 401) {
            alert("인증이 필요합니다. 다시 로그인해주세요.");
          } else if (apiError.response?.status === 400) {
            alert(apiError.response?.data?.message || "잘못된 요청입니다.");
          } else {
            alert("안내 내용을 불러오는데 실패했습니다. 다시 시도해주세요.");
          }
        }
      } else if (buttonText === "교환/반품") {
        try {
          await sendExchangeReturnMessage(numericRoomId);
          // WebSocket을 통해 자동으로 메시지가 수신되므로 별도 처리 불필요
        } catch (apiError) {
          console.error("교환/반품 API 오류:", apiError);
          
          if (apiError.response?.status === 403) {
            alert(apiError.response?.data?.message || "안내 메시지를 전송할 권한이 없습니다.");
          } else if (apiError.response?.status === 401) {
            alert("인증이 필요합니다. 다시 로그인해주세요.");
          } else if (apiError.response?.status === 400) {
            alert(apiError.response?.data?.message || "잘못된 요청입니다.");
          } else {
            alert("안내 내용을 불러오는데 실패했습니다. 다시 시도해주세요.");
          }
        }
      } else if (buttonText === "배송전 변경 및 취소") {
        // API가 없으므로 기존 방식으로 메시지 전송
        // 안내 메시지는 SYSTEM 타입으로 전송하여 왼쪽 회색 박스로 표시
        const content = getOrderChangeCancelContent();
        
        // 시스템 안내 메시지는 USER로 전송하되 messageType을 SYSTEM으로 설정
        // 백엔드에서 SYSTEM 타입은 adminId 검증을 건너뛸 수 있도록 처리 필요
        // 임시 해결책: 현재 사용자 ID로 전송하되, 렌더링 시 SYSTEM으로 처리
        await sendTextMessage({
          roomId: numericRoomId,
          sender: "USER",
          message: content,
          messageType: "SYSTEM",
          metadata: null,
          userId: currentUser.id,
          adminId: null,
        });
      } else if (buttonText === "상담원 연결하기") {
        // 상담원 연결하기 안내 메시지
        const content = `궁금하신 내용을 남겨주시면 담당자가 순차적으로 답변드릴 예정입니다.\n\n상담센터 운영시간\n평일 10:00 ~ 17:00\n\n편하게 궁금하신 점 남겨주세요:)`;
        
        // 시스템 안내 메시지는 USER로 전송하되 messageType을 SYSTEM으로 설정
        await sendTextMessage({
          roomId: numericRoomId,
          sender: "USER",
          message: content,
          messageType: "SYSTEM",
          metadata: null,
          userId: currentUser.id,
          adminId: null,
        });
      }
    } catch (error) {
      console.error("안내 메시지 전송 실패:", error);
      
      if (error.response?.status === 403) {
        alert(error.response?.data?.message || "안내 메시지를 전송할 권한이 없습니다.");
      } else if (error.response?.status === 401) {
        alert("인증이 필요합니다. 다시 로그인해주세요.");
      } else if (error.response?.status === 400) {
        alert(error.response?.data?.message || "잘못된 요청입니다.");
      } else {
        alert("안내 내용을 불러오는데 실패했습니다. 다시 시도해주세요.");
      }
    }
  };

  // 네이버페이 관련 텍스트 제거 함수
  const removeNaverPayText = (content) => {
    if (!content) return content;
    // 네이버페이 관련 문구 제거 (전체 줄 제거)
    return content
      .replace(/.*네이버페이.*?\n?/g, '')
      .replace(/.*네이버 페이.*?\n?/g, '')
      .replace(/.*자사 주문내역이 아닌.*?\n?/g, '')
      .replace(/.*주문내역.*네이버.*?\n?/g, '')
      .replace(/.*통한 주문의 경우.*?\n?/g, '')
      .replace(/.*접수 진행.*?\n?/g, '')
      .split('\n')
      .filter(line => !line.includes('네이버') && !line.includes('자사 주문내역'))
      .join('\n')
      .trim();
  };


  // 메시지 렌더링
  const renderMessage = (message) => {
    const currentUser = StorageService.getUser();
    const isAdmin = currentUser?.role === "ROLE_ADMIN";
    
    const isSystemMessage = message.messageType === "SYSTEM";
    const isSystemButtons = message.messageType === "SYSTEM_BUTTONS";
    
    // 안내 메시지 감지 (모든 안내 메시지 포함)
    const isAnyGuidanceMessage = message.content && (
      message.content.startsWith("배송전 변경 및 취소 안내") ||
      message.content.includes("교환/반품 안내") ||
      message.content.includes("교환 및 반품") ||
      message.content.includes("궁금하신 내용을 남겨주시면 담당자가") ||
      message.content.includes("상담센터 운영시간") ||
      message.content.includes("편하게 궁금하신 점 남겨주세요") ||
      message.content.includes("고객님께서 주문하시는 제품은 모두") ||
      message.content.includes("주문 후 출고까지는 평균 2-3일") ||
      message.content.includes("안녕하세요 ModeOn입니다") ||
      message.content.includes("상품 수령일로부터 7일 이내")
    );
    
    // 안내 메시지 세부 분류 (참고용)
    const isDeliveryInquiryMessage = message.content && (
      message.content.includes("고객님께서 주문하시는 제품은 모두") ||
      message.content.includes("주문 후 출고까지는 평균 2-3일") ||
      message.content.includes("안녕하세요 ModeOn입니다")
    );
    
    const isExchangeReturnMessage = message.content && (
      message.content.includes("교환/반품 안내") ||
      message.content.includes("교환 및 반품") ||
      message.content.includes("상품 수령일로부터 7일 이내")
    );
    
    const isGuidanceMessage = message.content && (
      message.content.startsWith("배송전 변경 및 취소 안내") ||
      message.content.includes("교환/반품 안내") ||
      message.content.includes("궁금하신 내용을 남겨주시면 담당자가") ||
      message.content.includes("상담센터 운영시간") ||
      message.content.includes("편하게 궁금하신 점 남겨주세요")
    );
    
    // 네이버페이 관련 텍스트 제거
    const cleanedContent = removeNaverPayText(message.content);
    
    // 안내 메시지는 모두 왼쪽 회색 박스로 표시 (관리자/일반 사용자 구분 없음)
    // 단, 사용자가 버튼을 클릭한 메시지(버튼 텍스트)는 오른쪽 파란색 박스로 표시
    if (isAnyGuidanceMessage || isSystemMessage) {
      // 안내 메시지 렌더링 (왼쪽 회색 박스)
      return (
        <div key={message.id} className="flex justify-start mb-4">
          <div className="max-w-md px-4 py-3 rounded-lg bg-gray-200 text-gray-800">
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {cleanedContent}
            </p>
          </div>
        </div>
      );
    }
    
    // 사용자 메시지인지 확인 (안내 메시지 제외)
    const isOwnMessage = 
      (!isSystemMessage && !isGuidanceMessage && !isDeliveryInquiryMessage && !isExchangeReturnMessage && (
        message.senderId === currentUserId || 
        (message.sender === "USER" && message.userId === currentUserId) ||
        (message.sender === "ADMIN" && message.adminId === currentUserId)
      )) ||
      // 일반 사용자가 보낸 일반 텍스트 메시지 (안내 메시지가 아닌 경우)
      (!isAdmin && !isSystemMessage && !isGuidanceMessage && !isDeliveryInquiryMessage && 
       message.messageType === "TEXT" && 
       (message.sender === "USER" || message.senderId === currentUserId));


    // 시스템 버튼 메시지 (회색 배경, 검은 글씨)
    if (isSystemButtons) {
      let buttons = [];
      try {
        if (message.metadata) {
          const metadata = typeof message.metadata === 'string' 
            ? JSON.parse(message.metadata) 
            : message.metadata;
          buttons = metadata.buttons || [];
        }
      } catch (error) {
        console.error("버튼 메타데이터 파싱 실패:", error);
      }
      
      // 기본 버튼이 없으면 기본 3가지 선택지 제공
      if (buttons.length === 0) {
        buttons = [
          "입고 및 배송 문의",
          "배송전 변경 및 취소",
          "교환/반품"
        ];
      }

      return (
        <div key={message.id} className="flex justify-start mb-4">
          <div className="max-w-md px-4 py-3 rounded-lg bg-gray-200 text-gray-800">
            {message.content && (
              <p className="whitespace-pre-wrap break-words text-sm leading-relaxed mb-3">
                {message.content}
              </p>
            )}
                   {buttons.length > 0 && (
                     <div className="flex flex-col gap-2">
                       {buttons.map((buttonText, index) => (
                         <button
                           key={index}
                           onClick={() => handleButtonClick(buttonText)}
                           className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors text-left"
                         >
                           {buttonText}
                         </button>
                       ))}
                       {/* 상담원 연결하기 버튼 (항상 맨 아래에 표시) */}
                       <button
                         onClick={() => handleButtonClick("상담원 연결하기")}
                         className="w-full px-4 py-2.5 text-sm font-medium text-gray-800 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-colors text-left"
                       >
                         상담원 연결하기
                       </button>
                     </div>
                   )}
          </div>
        </div>
      );
    }

    return (
      <div
        key={message.id}
        className={`flex mb-4 ${isOwnMessage ? "justify-end" : "justify-start"}`}
      >
        <div
          className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
            isOwnMessage
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {message.messageType === "IMAGE" && message.fileUrl && (
            <div className="mb-2">
              <img
                src={message.fileUrl}
                alt="이미지"
                className="max-w-full h-auto rounded-lg cursor-pointer"
                onClick={() => {
                  if (message.fileUrl.startsWith('data:')) {
                    // Base64 이미지는 새 창에서 열기
                    const newWindow = window.open();
                    if (newWindow) {
                      newWindow.document.write(`<img src="${message.fileUrl}" style="max-width: 100%; height: auto;" />`);
                    }
                  } else {
                    window.open(message.fileUrl, "_blank");
                  }
                }}
                onError={(e) => {
                  console.error("이미지 로드 실패:", message.fileUrl);
                  e.target.style.display = "none";
                  const errorDiv = document.createElement("div");
                  errorDiv.className = "text-sm text-gray-500 p-2";
                  errorDiv.textContent = "이미지를 불러올 수 없습니다.";
                  e.target.parentNode.appendChild(errorDiv);
                }}
              />
              {/* content가 Base64 문자열이 아니고 실제 텍스트인 경우만 표시 */}
              {message.content && 
               !message.content.startsWith('data:image') && 
               message.content.trim() && (
                <p className="mt-2 text-sm">{message.content}</p>
              )}
            </div>
          )}

          {message.messageType === "FILE" && (
            <div className="mb-2">
              <a
                href={message.fileUrl}
                download={message.fileName}
                className="flex items-center gap-2 p-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {message.fileName || "파일"}
                  </p>
                  <p className="text-xs opacity-75">다운로드</p>
                </div>
              </a>
              {message.content && (
                <p className="mt-2 text-sm">{message.content}</p>
              )}
            </div>
          )}

          {message.messageType === "TEXT" && (
            <p className="whitespace-pre-wrap break-words">{message.content}</p>
          )}
        </div>
      </div>
    );
  };

  // 안내사항(SYSTEM_BUTTONS)을 최상단에 고정하기 위해 정렬
  const sortedMessages = [...roomMessages].sort((a, b) => {
    const aIsSystemButtons = a.messageType === "SYSTEM_BUTTONS";
    const bIsSystemButtons = b.messageType === "SYSTEM_BUTTONS";
    
    // SYSTEM_BUTTONS 타입은 항상 최상단
    if (aIsSystemButtons && !bIsSystemButtons) return -1;
    if (!aIsSystemButtons && bIsSystemButtons) return 1;
    
    // SYSTEM_BUTTONS끼리는 최신 것이 위로 (timestamp 기준 내림차순)
    if (aIsSystemButtons && bIsSystemButtons) {
      return new Date(b.timestamp) - new Date(a.timestamp);
    }
    
    // 나머지는 시간순 정렬
    return new Date(a.timestamp) - new Date(b.timestamp);
  });
  

  return (
    <div ref={containerRef} className="h-full overflow-y-auto p-4 space-y-2">
      {sortedMessages.length === 0 ? (
        <div className="flex items-center justify-center h-full text-gray-400">
          <p>메시지를 불러오는 중...</p>
        </div>
      ) : (
        <>
          {sortedMessages.map(renderMessage)}
          {hasTypingUser(stringRoomId) && <TypingIndicator />}
        </>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;

