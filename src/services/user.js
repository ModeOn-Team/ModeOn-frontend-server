import axios from "axios";

const API_BASE_URL = "/api/users";

/**
 * @param {number} userId
 * @returns {Promise<Object>}
 */
export const getUserMembership = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${userId}`);
    return response.data;
  } catch (error) {
    console.error(
      `[User API] 사용자 ID ${userId}의 멤버십 정보 로드 실패:`,
      error
    );
    throw new Error("사용자 정보 로드 중 오류가 발생했습니다.");
  }
};
