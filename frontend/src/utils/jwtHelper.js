// Helper to parse JWT payload on client side
export const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Generates a mock signed-like JWT for dev demo logins matching ScholarOS ERP spec
export const createDevToken = ({ userId, username, role, schoolId, sectionId, gradeId, academicYearId }) => {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const payload = {
    sub: userId || 'b4e8590a-1122-3344-5566-778899aabbcc',
    username: username || 'demo_user',
    iss: 'scholaros-erp-auth-service',
    aud: 'scholaros-homework-intelligence-service',
    role: role || 'ROLE_TEACHER',
    schoolId: schoolId || 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    sectionId: sectionId || 'f8e7d6c5-b4a3-2109-8765-43210fedcba9',
    gradeId: gradeId || '99887766-5544-3322-1100-aabbccddeeff',
    academicYearId: academicYearId || '11223344-5566-7788-9900-aabbccddeeff',
    iat: now,
    exp: now + 86400 * 7, // 7 days
  };

  const base64UrlEncode = (obj) => {
    return btoa(JSON.stringify(obj))
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_');
  };

  const encodedHeader = base64UrlEncode(header);
  const encodedPayload = base64UrlEncode(payload);
  const signature = 'dev_mock_signature_for_scholaros_token';

  return `${encodedHeader}.${encodedPayload}.${signature}`;
};
