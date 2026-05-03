-- Tabela para armazenar treinos atribuídos aos alunos
CREATE TABLE student_workouts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255) NOT NULL,
    workout_name VARCHAR(255) NOT NULL,
    workout_data TEXT NOT NULL, -- JSON com dados completos do treino
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar cálculos energéticos atribuídos aos alunos
CREATE TABLE student_calculations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255) NOT NULL,
    calculation_name VARCHAR(255) NOT NULL,
    calculation_data TEXT NOT NULL, -- JSON com dados completos do cálculo
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela para armazenar dietas atribuídas aos alunos
CREATE TABLE student_diets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    student_email VARCHAR(255) NOT NULL,
    personal_email VARCHAR(255) NOT NULL,
    diet_name VARCHAR(255) NOT NULL,
    diet_data TEXT NOT NULL, -- JSON com dados completos da dieta
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_student_workouts_student ON student_workouts(student_email);
CREATE INDEX idx_student_workouts_personal ON student_workouts(personal_email);
CREATE INDEX idx_student_workouts_assigned ON student_workouts(assigned_at);

CREATE INDEX idx_student_calculations_student ON student_calculations(student_email);
CREATE INDEX idx_student_calculations_personal ON student_calculations(personal_email);
CREATE INDEX idx_student_calculations_assigned ON student_calculations(assigned_at);

CREATE INDEX idx_student_diets_student ON student_diets(student_email);
CREATE INDEX idx_student_diets_personal ON student_diets(personal_email);
CREATE INDEX idx_student_diets_assigned ON student_diets(assigned_at);
