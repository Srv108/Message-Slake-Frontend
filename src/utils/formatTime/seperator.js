export const seperateTimeFormat = (targetDateStr) => {
    const currentDate = new Date();
    const targetDate = new Date(targetDateStr);
        
    const diffInMilliSeconds = currentDate - targetDate;
    const diffInDays = Math.floor(diffInMilliSeconds/(1000*3600*24));
    
    const currentYear = currentDate.getFullYear();

    const formattedDate = targetDate.toLocaleDateString('en-US',{
        day: 'numeric',    
        weekday: 'long',  
        month: 'long',
        year: 'numeric',
    });

    let currentSeperator = '';

    const [ weekday, monthDay, year] = formattedDate.split(', ');
    const [ month, day ] = monthDay.split(' ');

    const currentDay = currentDate.getDate();

    if (diffInDays === 0) {
        if(currentDay != day) currentSeperator = 'Yesterday';
        currentSeperator = 'Today';
    } else if (diffInDays === 1) {
        currentSeperator = 'Yesterday';
    } else if (diffInDays < 7) {
        currentSeperator = weekday;
    } else if (diffInDays < 30 && currentYear == parseInt(year)) {
        currentSeperator = `${day} ${month}`;
    } else {
        currentSeperator = `${day} ${month} ${year}`;
    }

    return currentSeperator;
};