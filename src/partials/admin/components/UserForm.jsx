import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function UserForm({ register, onSubmit, onError, handleSubmit, isEditing = false, buttonText = "Enviar" }) {
  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} className="space-y-6">
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input id="name" {...register("name")} required />
      </div>
      <div>
        <Label htmlFor="lastname">Apellido</Label>
        <Input id="lastname" {...register("lastname")} required />
      </div>
      <div>
        <Label htmlFor="password">Contraseña</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          required={!isEditing}
          placeholder={isEditing ? "Dejar en blanco para no cambiar" : ""}
        />
      </div>
      <div>
        <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
          required={!isEditing}
          placeholder={isEditing ? "Dejar en blanco para no cambiar" : ""}
        />
      </div>
      <Button type="submit">{buttonText}</Button>
    </form>
  );
}