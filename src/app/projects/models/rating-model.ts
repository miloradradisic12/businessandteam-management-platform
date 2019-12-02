export class RatingModel {
    id?: number;//ratingId
    rating: number;
    parameter: number;//paramId
    employee_rating_details?: number;
}

export class employeeProjectTask {
    constructor() {
        this.subtasks = [];
    }
    id: number;//projectId
    title: string;//project
    subtasks: subtasksInfo[];
}

export class subtasksInfo {
    constructor() {
        this.employee_ratings = [];
    }
    id: number;//taskId
    title: string;
    average_rating: number;
    employee_ratings: RatingModel[];
}

export class ParameterInfo {
    id: number;
    title: string;
    is_active: boolean;
    rating: number;
}

export class EmployeeRateInfo {
    constructor() {
        this.employee_ratings = [];
    }
    id: number;//employeeRatingId
    task: number;//taskId
    employee: number;//employeeId
    creator: number;//creatorId
    employee_ratings: RatingModel[];
}

export class CurrentEmployeeRating {
    constructor() {
        this.rating_details = [];
    }
    id: number;
    first_name: string;
    last_name: string;
    user: number;
    average_rating: number;
    rating_details: {
        rating: number;
        parameter: string;
        employer_count: number;
    }[];
}
