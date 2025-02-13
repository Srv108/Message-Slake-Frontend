export const seperateTimeFormat = (targetDateStr) => {
    const currentDate = new Date();
    const targetDate = new Date(targetDateStr);
        
    const diffInMilliSeconds = currentDate - targetDate;
    const diffInDays = Math.floor(diffInMilliSeconds/(1000*3600*24));
    
    const formattedDate = targetDate.toLocaleDateString('en-US',{
        day: 'numeric',    
        weekday: 'long',  
        month: 'long',
        year: 'numeric',
    });

    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const currentDay = currentDate.getDate();

    const targetYear = targetDate.getFullYear();
    const targetMonth = targetDate.getMonth();
    const targetDay = targetDate.getDate();

    let currentSeperator = '';

    // eslint-disable-next-line no-unused-vars
    const [ weekday, monthDay, year ] = formattedDate.split(', ');
    const [ month, day ] = monthDay.split(' ');

    const utcDate = new Date(targetDateStr);
    const istDate = utcDate.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    
    // eslint-disable-next-line no-unused-vars
    const [ currDate, currTime ] = istDate.split(',');

    if (currentYear === targetYear &&
        currentMonth === targetMonth &&
        currentDay === targetDay) {
            currentSeperator = 'Today';
    } else if (currentYear === targetYear &&
        currentMonth === targetMonth &&
        currentDay - targetDay === 1) {
            currentSeperator = 'Yesterday';
    } else if (diffInDays < 7) {
        currentSeperator = weekday;
    } else if (currentYear === targetYear) {
        currentSeperator = `${day} ${month}`;
    } else {
        currentSeperator = currDate;
    }

    return currentSeperator;
};