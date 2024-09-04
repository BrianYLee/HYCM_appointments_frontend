const normalizeDate = (input) => {
    const currentYear = new Date().getFullYear();

    // Define regex patterns for different date formats
    const patterns = [
        { regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/, format: 'full', groups: [1, 2, 3] }, // 2024-08-11, 2024-8-4
        { regex: /^(\d{4})\.(\d{1,2})\.(\d{1,2})$/, format: 'fullDot', groups: [1, 2, 3] }, // 2024.8.4, 2025.11.23
        { regex: /^(\d{2})\.(\d{1,2})\.(\d{1,2})$/, format: 'shortYearDot', groups: [1, 2, 3] }, // 25.1.2 (assume 2025)
        { regex: /^(\d{1,2})-(\d{1,2})$/, format: 'partialDash', groups: [1, 2] }, // 8-11
        { regex: /^(\d{1,2})\.(\d{1,2})$/, format: 'partialDot', groups: [1, 2] }, // 8.11
        { regex: /^(\d{4})年(\d{1,2})月(\d{1,2})日$/, format: 'chineseFull', groups: [1, 2, 3] }, // 2024年7月3日
        { regex: /^(\d{2})年(\d{1,2})月(\d{1,2})日$/, format: 'chineseShortYear', groups: [1, 2, 3] }, // 25年8月11日 (assume 2025)
        { regex: /^(\d{1,2})月(\d{1,2})日$/, format: 'chinesePartial', groups: [1, 2] } // 8月11日
    ];

    let year = currentYear;
    let month, day;

    for (const pattern of patterns) {
        const match = input.match(pattern.regex);
        if (match) {
            if (pattern.format === 'full' || pattern.format === 'fullDot' || pattern.format === 'chineseFull') {
                year = match[pattern.groups[0]];
                month = match[pattern.groups[1]];
                day = match[pattern.groups[2]];
            } else if (pattern.format === 'shortYearDot' || pattern.format === 'chineseShortYear') {
                year = `20${match[pattern.groups[0]]}`; // Assume 20XX for short year formats like 25年8月11日 or 25.1.2
                month = match[pattern.groups[1]];
                day = match[pattern.groups[2]];
            } else if (pattern.format === 'partialDash' || pattern.format === 'partialDot' || pattern.format === 'chinesePartial') {
                month = match[pattern.groups[0]];
                day = match[pattern.groups[1]];
            }

            // Ensure month and day are always double digits
            month = month.padStart(2, '0');
            day = day.padStart(2, '0');

            return `${year}-${month}-${day}`;
        }
    }

    return null; // didnt match any known formats
}

const normalizeType = (input) => {
    if (input.includes('客')) {
        return '客片';
    }
    if (input.includes('样')) {
        return '样片';
    }
    return null;
}

const determineKey = (key) => {
    if (key == '日期' || key == '拍摄日期') return 'scheduled_date';
    if (key.includes('时间')) return 'scheduled_time_string';
    if (key == '类' || key == '类型' || key == '拍摄类' || key == '拍摄类型') return 'type';
    if (key == '区' || key == '区域' || key == '拍摄区' || key == '拍摄区域') return 'areas';
    if (key.includes('机构')) return 'studio_name';
    if (key == '摄影师' || key == '老师' || key == '拍摄老师' ) return 'manager_name';
    if (key == '客人' || key == '客人姓名' || key == '新人' || key == '新人名' || key == '新人姓名') return 'bridal_name';
    if (key == '车牌' || key == '车牌号') return 'plate';
    return null;
}

const parseLine = (key, value) => {
    let parsedKey = determineKey(key);
    if (!parsedKey) {
        return null;
    }
    if (parsedKey == 'scheduled_date') {
        let parsedVal = normalizeDate(value);
        if (parsedVal) {
            return { scheduled_date: parsedVal };
        }
        return null;
    }
    if (parsedKey == 'scheduled_time_string') {
        return { scheduled_time_string: value };
    }
    if (parsedKey == 'type' ) {
        let parsedVal = normalizeType(value);
        if (parsedVal) {
            return { type: parsedVal };
        }
    }
    if (parsedKey == 'areas') {
        let hasHorse = value.includes('马');
        return { areas: value, horse: hasHorse};
    }
    if (parsedKey == 'studio_name') {
        return { studio_name: value };
    }
    if (parsedKey == 'manager_name' ) {
        return { manager_name: value };
    }
    if (parsedKey == 'bridal_name') {
        return { bridal_name: value }
    }
    if (parsedKey == 'plate') {
        return { plate: value }
    }
}

export const parseAppointment = (input) => {
    const lines = input.split('\n');
    let output = null;
    lines.forEach(line => {
        let [key, value] = line.split('：').map(part => part.trim());
        if (key && value) {
            let kvPair = parseLine(key, value);
            if (kvPair) {
                output = { ...output, ...kvPair };
            }
        }
    });
    return output;
}
