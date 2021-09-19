//Plus besoin de interface parceque on utilise la base de donner. et aussi le nom a ete change de 'task.model.ts' a task-status.enum.ts
// export interface Task {
//   id: string;
//   title: string;
//   description: string;
//   status: TaskStatus;
// }

export enum TaskStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}
