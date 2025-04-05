import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    done: { type: mongoose.SchemaTypes.Boolean, required: true },
    user: { type: mongoose.SchemaTypes.ObjectId },
    dueDate: { type: Date }, // Data de vencimento da tarefa
    completedAt: { type: Date }, // Data em que a tarefa foi concluída
    category: {
      type: String,
      enum: ["Trabalho", "Lazer", "Estudo"],
      default: "Trabalho",
    }, // Nova propriedade de categoria
  },
  { timestamps: true }
); // Adiciona createdAt e updatedAt automaticamente

const Todo = mongoose.model("Todo", TodoSchema);

export default Todo;
