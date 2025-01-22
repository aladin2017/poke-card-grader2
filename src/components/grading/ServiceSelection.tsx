import { UseFormReturn } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "./formSchema";
import { Clock, Zap } from "lucide-react";

interface ServiceSelectionProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}

export function ServiceSelection({ form }: ServiceSelectionProps) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-sm font-medium mb-3">Tip serviciu</h3>
        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            className={`p-4 rounded border ${
              form.watch("serviceType") === "standard"
                ? "border-pink-500 bg-pink-500/5"
                : "border-gray-200 hover:border-pink-500"
            } transition-colors`}
            onClick={() => form.setValue("serviceType", "standard")}
          >
            <Clock className="w-5 h-5 mx-auto mb-2" />
            <div className="text-sm font-medium">STANDARD</div>
            <div className="text-pink-500">15€</div>
          </button>
          <button
            type="button"
            className={`p-4 rounded border ${
              form.watch("serviceType") === "medium"
                ? "border-pink-500 bg-pink-500/5"
                : "border-gray-200 hover:border-pink-500"
            } transition-colors`}
            onClick={() => form.setValue("serviceType", "medium")}
          >
            <Clock className="w-5 h-5 mx-auto mb-2" />
            <div className="text-sm font-medium">MEDIUM</div>
            <div className="text-pink-500">20€</div>
          </button>
          <button
            type="button"
            className={`p-4 rounded border ${
              form.watch("serviceType") === "priority"
                ? "border-pink-500 bg-pink-500/5"
                : "border-gray-200 hover:border-pink-500"
            } transition-colors`}
            onClick={() => form.setValue("serviceType", "priority")}
          >
            <Zap className="w-5 h-5 mx-auto mb-2" />
            <div className="text-sm font-medium">PRIORITY</div>
            <div className="text-pink-500">25€</div>
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-sm font-medium mb-3">Metodă de livrare</h3>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            className={`p-4 rounded border ${
              form.watch("shippingMethod") === "standard"
                ? "border-pink-500 bg-pink-500/5"
                : "border-gray-200 hover:border-pink-500"
            } transition-colors`}
            onClick={() => form.setValue("shippingMethod", "standard")}
          >
            <div className="text-sm font-medium">STANDARD</div>
            <div className="text-pink-500">10€</div>
          </button>
          <button
            type="button"
            className={`p-4 rounded border ${
              form.watch("shippingMethod") === "express"
                ? "border-pink-500 bg-pink-500/5"
                : "border-gray-200 hover:border-pink-500"
            } transition-colors`}
            onClick={() => form.setValue("shippingMethod", "express")}
          >
            <div className="text-sm font-medium">EXPRESS</div>
            <div className="text-pink-500">25€</div>
          </button>
        </div>
      </div>
    </div>
  );
}