export const formatTime = (targetDateStr) => {
    const targetDate = new Date(targetDateStr);

    const formattedTime = targetDate.toLocaleTimeString('en-US',{
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    return formattedTime;
};