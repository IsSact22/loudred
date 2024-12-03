"use client";

/* Components */
import { generateBreadcrumbs } from "@/src/layouts/Breadcrumbs";
import { TextIconButton } from "@/src/components/buttons/TextIconButton";

/* Hooks */
import { usePathname, useRouter } from "next/navigation";

/* Icons */
import { TbChevronLeft } from "react-icons/tb";

export const CrumbBackButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const breadcrumbs = generateBreadcrumbs(pathname);
  const previousBreadcrumb = breadcrumbs[breadcrumbs.length - 2]; // Obtener el penúltimo breadcrumb

  if (!previousBreadcrumb) {
    return null;
  }

  return (
    <TextIconButton
      icon={<TbChevronLeft className="w-5 h-5" />}
      text="Salir"
      onClick={() => router.push(previousBreadcrumb.href)}
      type="button"
      margin=""
      padding="pl-0.5 pr-2 py-1"
      bgColor=""
      shadowAndColor=""
      textColor="text-navy"
      bgColorHover="hover:bg-navy"
      shadowAndColorHover="hover:shadow-md hover:shadow-navy-light"
    />
  );
};
