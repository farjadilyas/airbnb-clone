// Function to get Day difference
const getDayDiff = (d1, d2) => {
    const date1 = new Date(d1);
    const date2 = new Date(d2);
    console.log(d1);
    const diffTime = Math.abs(date2 - date1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays; 
}

export default {
    getDayDiff
}
