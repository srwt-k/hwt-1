"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge }             from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator }         from "@/components/ui/separator";
import { AlertCircle, Clock } from "lucide-react";
import { LimitResult } from "@/features/orders/types";
import { formatDate } from "@/lib/utils";

interface Props {
  open:       boolean;
  violations: LimitResult[];
  onClose:    () => void;
}

export function LimitViolationDialog({ open, violations, onClose }: Props) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">

        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="w-5 h-5" />
            Order Not Allowed
          </DialogTitle>
          <DialogDescription>
            These items cannot be ordered, due to limits.
          </DialogDescription>
        </DialogHeader>

        <div className="-mx-4 overflow-y-auto max-h-[60vh]">
          {violations.map((v, i) => (
            <Card key={i} className="border-destructive/30 m-4">
              <CardContent className="p-4 flex flex-col gap-3">

                {/* Item */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{v.item.name}</span>
                  </div>
                  <Badge variant="destructive">Unavailable</Badge>
                </div>

                <Separator />

                {/* Why */}
                <div className="flex flex-col gap-1.5 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Reason</span>
                    <span className="text-foreground font-medium">{v.limitRule.name}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Limit</span>
                    <span className="text-foreground font-medium">
                      {v.limitRule.maxLimit} per {v.limitRule.timeLimit} min
                    </span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Already ordered</span>
                    <span className="text-destructive font-medium">{v.addedQty ? `${v.orderedQty}+${v.addedQty}` : v.orderedQty}</span>
                  </div>
                </div>

                <Separator />

                {/* Reset time */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Available again at</span>
                  </div>
                  <span className="font-semibold text-orange-500">
                    {formatDate(v.resetsAt)}
                  </span>
                </div>

              </CardContent>
            </Card>
          ))}
        </div>

      </DialogContent>
    </Dialog>
  );
}