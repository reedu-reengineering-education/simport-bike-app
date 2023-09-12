"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { Settings2Icon, SettingsIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "../ui/form";
import { Slider } from "../ui/slider";
import { Switch } from "../ui/switch";
import { useSettingsStore } from "@/lib/store/useSettingsStore";
import { Button } from "../ui/button";
import { DialogClose } from "@radix-ui/react-dialog";

const formSchema = z.object({
  uploadInterval: z.number().min(1).max(60),
  switchUseDeviceGPS: z.boolean(),
  switchLiveMode: z.boolean(),
});

export default function SettingsModal() {
  const uploadInterval = useSettingsStore((state) => state.uploadInterval);
  const useDeviceGPS = useSettingsStore((state) => state.useDeviceGPS);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uploadInterval: uploadInterval,
      switchUseDeviceGPS: useDeviceGPS,
      switchLiveMode: false,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    useSettingsStore.setState({
      uploadInterval: values.uploadInterval,
      useDeviceGPS: values.switchUseDeviceGPS,
    });
  };

  return (
    <Dialog>
      <DialogTrigger>
        <SettingsIcon className="h-10 w-10" />
      </DialogTrigger>
      <DialogContent className="w-11/12">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4 justify-end">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-8"
            >
              <div>
                <div className="space-y-4">
                  <FormField
                    name="uploadInterval"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Upload Interval</FormLabel>
                        <FormDescription>
                          Upload Interval (in Sekunden) bestimmen
                        </FormDescription>
                        <FormControl>
                          <Slider
                            onValueChange={(e) => field.onChange(e[0])}
                            defaultValue={[field.value]}
                            min={1}
                            max={60}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name="switchUseDeviceGPS"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Use Device GPS</FormLabel>
                        <FormDescription>
                          {" "}
                          Das GPS vom Smartphone benutzen oder von der
                          senseBox:bike
                        </FormDescription>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <DialogClose className="float-right">
                <Button type="submit">Speichern</Button>
              </DialogClose>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
