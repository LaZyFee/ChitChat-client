const convertBufferToBase64 = (buffer) => {
    if (buffer && buffer.data) {
        const binary = buffer.data.map(byte => String.fromCharCode(byte)).join('');
        return window.btoa(binary);
    }
    return null;
};

export default convertBufferToBase64;
