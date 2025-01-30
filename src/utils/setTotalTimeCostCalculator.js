export const getTotalTime = async (frequency, totalTime) => {
    let dayTime;
    let monthTime;
    switch (frequency) {
        case 'None':
        case null:
            dayTime = 0;
            monthTime = 0;
            break;
        case 'One Time':
            dayTime = (totalTime / 60);
            monthTime = 1;
            break;
        case 'Weekly':
            dayTime = (totalTime / 60);
            monthTime = ((totalTime * 4.33) / 60);
            break;
        case '2 Days a Week':
            dayTime = (totalTime / 60);
            monthTime = ((totalTime * 8.66) / 60);
            break;
        case '3 Days a Week':
            dayTime = (totalTime / 60);
            monthTime = ((totalTime * 13) / 60);
            break;
        case '4 Days a Week':
            dayTime = (totalTime / 60);
            monthTime = ((totalTime * 17.33) / 60);
            break;
        case '5 Days a Week':
            dayTime = (totalTime / 60);
            monthTime = ((totalTime * 21.66) / 60);
            break;
        case '6 Days a Week':
            dayTime = (totalTime / 60);
            monthTime = ((totalTime * 26) / 60);
            break;
        case '7 Days a Week':
            dayTime = (totalTime / 60);
            monthTime = ((totalTime * 30) / 60);
            break;
        case '1 Day a Month':
            dayTime = (totalTime / 60);
            monthTime = (totalTime / 60);
            break;
        case 'Quarterly':
        case 'Yearly':
            dayTime = (totalTime / 60);
            monthTime = 0;
            break;
        default:
            dayTime = (totalTime / 60);
            monthTime = 0;
            break;
    }
    return {dayTime: dayTime, monthTime: monthTime}
  
    
  };
  
