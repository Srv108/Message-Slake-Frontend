export const formatTime = (currentDate,targetDateStr) => {
    const targetDate = new Date(targetDateStr);
        
    const diffInMilliSeconds = currentDate - targetDate;
    const diffInSec = Math.floor(diffInMilliSeconds/(1000));
    const diffInMin = Math.floor(diffInMilliSeconds/(1000*60));
    const diffInHours = Math.floor(diffInMilliSeconds/(1000*3600));
    const diffInDays = Math.floor(diffInMilliSeconds/(1000*3600*24));
    
    const currentYear = currentDate.getFullYear();

    const formattedDate = targetDate.toLocaleDateString('en-US',{
        weekday: 'short',  
        month: 'short',    
        year: 'numeric',
    });

    const formattedTime = targetDate.toLocaleTimeString('en-US',{
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    const day = targetDate.getDay();

    const [month, year, weekday] = formattedDate.split(' ');

    if (diffInSec < 60){
        return `${diffInSec} sec `;
    } else if (diffInMin < 60) {
        return `${diffInMin} min ago`;
    } else if (diffInHours < 24) {
        if(currentDate.getDate() !== targetDate.getDate()){
            return 'Yesterday';
        } else return formattedTime;
    } else if (diffInDays < 2) {
        return 'Yesterday';
    } else if (diffInDays < 7) {
        return weekday;
    } else if (diffInDays < 30 && currentYear == parseInt(year)) {
        return `${day} ${month}`;
    } else {
        return `${day} ${month} ${year}`;
    }
};