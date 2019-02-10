const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const makeFullDateString = (date: Date): string => {
    const day = days[date.getDay()];
    const month = months[date.getMonth()];
    const dayNum = date.getDate();
    let hours = date.getHours();
    const minutes = date.getMinutes();

    const ampm = hours < 12 ? 'am' : 'pm';
    hours %= 12;
    if (hours === 0) { hours = 12; }
    const minuteString = minutes < 10 ? `0${minutes}` : `${minutes}`;

    return `${day} ${month} ${dayNum} at ${hours}:${minuteString} ${ampm}`;
};

export const makeTimeString = (timestamp: number): string => {
    const now = new Date();
    const date = new Date(timestamp * 1000);
    const diffSeconds = (now.getTime() - date.getTime()) / 1000;

    if (diffSeconds < 300) { // five minutes
        return 'A few minutes ago';
    } else if (diffSeconds < 3600) { // one hour
        const minutes = Math.floor(diffSeconds / 60);
        return `${minutes} minutes ago`;
    } else if (diffSeconds < 7200) { // two hours
        return 'About an hour ago';
    } else if (diffSeconds < 18000) { // five hours
        const hours = Math.floor(diffSeconds / 3600);
        return `${hours} hours ago`;
    } else {
        return makeFullDateString(date);
    }
};
