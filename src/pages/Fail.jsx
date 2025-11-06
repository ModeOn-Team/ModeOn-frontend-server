import { useSearchParams } from "react-router-dom";

function Fail() {
  const [params] = useSearchParams();
  const message = params.get("message");
  const code = params.get("code");

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>결제가 실패했습니다 </h2>
      <p>사유: {message}</p>
      <p>코드: {code}</p>
    </div>
  );
}

export default Fail;
