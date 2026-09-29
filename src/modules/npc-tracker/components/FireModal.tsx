"use client";

import { useState } from "react";
import { Button, FieldError, Modal } from "@/core/ui";
import { ARMOR_LABELS, type ArmorLocations } from "@/modules/bestiary/client";
import { EFFECTS } from "../effects/catalog";
import { fireBaseForLocation, fireDamage } from "../effects/fire";
import { BODY_LOCATIONS, type BodyLocation } from "../effects/types";
import { EffectInfo } from "./EffectInfo";
import { Actions } from "./EffectInfo.styles";
import { BurningCell, FireTable, NumberCell, Total } from "./FireModal.styles";

type FireModalProps = {
  burning: BodyLocation[];
  armor: ArmorLocations;
  error?: string;
  onSetLocations: (locations: BodyLocation[]) => void;
  onClose: () => void;
};

export function FireModal({
  burning,
  armor,
  error,
  onSetLocations,
  onClose,
}: FireModalProps) {
  const [checked, setChecked] = useState<BodyLocation[]>([]);
  const selected = BODY_LOCATIONS.filter(
    (location) => burning.includes(location) || checked.includes(location),
  );
  const total = selected.reduce(
    (sum, location) => sum + fireDamage(location, armor[location]),
    0,
  );

  function toggle(location: BodyLocation, isChecked: boolean) {
    setChecked((current) =>
      isChecked
        ? [...current, location]
        : current.filter((item) => item !== location),
    );
  }

  return (
    <Modal title={`${EFFECTS.FIRE.icon} Fire`} onClose={onClose} wide>
      <EffectInfo definition={EFFECTS.FIRE} />
      <FireTable>
        <thead>
          <tr>
            <th>Part</th>
            <th>Fire dmg</th>
            <th>SP</th>
            <th>Final</th>
            <th>Burning</th>
          </tr>
        </thead>
        <tbody>
          {BODY_LOCATIONS.map((location) => {
            const isBurning = burning.includes(location);
            const label = ARMOR_LABELS[location];
            return (
              <tr key={location}>
                <td>{label}</td>
                <NumberCell>{fireBaseForLocation(location)}</NumberCell>
                <NumberCell>{armor[location]}</NumberCell>
                <NumberCell>{fireDamage(location, armor[location])}</NumberCell>
                <td>
                  {isBurning ? (
                    <BurningCell>
                      <span aria-label="Burning">🔥</span>
                      <Button
                        type="button"
                        onClick={() =>
                          onSetLocations(
                            burning.filter((item) => item !== location),
                          )
                        }
                      >
                        Extinguish
                      </Button>
                    </BurningCell>
                  ) : (
                    <input
                      type="checkbox"
                      aria-label={`Set ${label} on fire`}
                      checked={checked.includes(location)}
                      onChange={(event) =>
                        toggle(location, event.target.checked)
                      }
                    />
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </FireTable>
      <Total>
        Total per round: <strong>{total} HP</strong>
      </Total>
      {error && <FieldError>{error}</FieldError>}
      <Actions>
        <Button
          type="button"
          disabled={checked.length === 0}
          onClick={() => {
            onSetLocations(selected);
            setChecked([]);
          }}
        >
          Apply
        </Button>
        {burning.length > 0 && (
          <Button type="button" onClick={() => onSetLocations([])}>
            Extinguish All
          </Button>
        )}
      </Actions>
    </Modal>
  );
}
