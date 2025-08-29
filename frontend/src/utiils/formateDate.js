export const formateDate = (utcDateString) => {
    const date = new Date(utcDateString);
    const options = {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        timeZone: 'Asia/Dhaka'
    };
    const dhakaTime = date.toLocaleDateString('en-US', options);
    return dhakaTime;
}