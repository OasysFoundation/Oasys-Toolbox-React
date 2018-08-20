const CATEGORIES = {
    computerscience: ['object', 'programming', 'ml', 'swift', 'code'],
    chemistry: ['chemistry', 'atom', 'molecule'],
    physics: ['physic', 'simulation', 'work'],
}

function getTagsForCategory(category) {
    const str = category.trim().toLowerCase();
    return CATEGORIES[str] || [];
};

export {getTagsForCategory}