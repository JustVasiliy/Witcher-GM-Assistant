"use client";

import { startTransition, useState } from "react";
import { Button, Input } from "@/core/ui";
import type { Creature } from "@/modules/bestiary/client";
import type { Note } from "@/generated/prisma/client";
import {
  deleteEncounter,
  detachNoteFromEncounter,
  renameEncounter,
} from "../actions";
import type { EncounterWithDetails } from "../types";
import { AddNpcModal } from "./AddNpcModal";
import { AttachNoteModal } from "./AttachNoteModal";
import {
  Actions,
  ExpandedPanel,
  Meta,
  NameButton,
  NameGroup,
  NoteItem,
  NotesList,
  Row,
  SectionHeading,
  SummaryBar,
  Toolbar,
} from "./EncounterRow.styles";
import { NpcTabs } from "./NpcTabs";
import { RoundCounter } from "./RoundCounter";

type EncounterRowProps = {
  encounter: EncounterWithDetails;
  campaignId: string;
  sessionId: string;
  creatureCatalog: Creature[];
  availableNotes: Note[];
  isExpanded: boolean;
  onToggle: () => void;
};

export function EncounterRow({
  encounter,
  campaignId,
  sessionId,
  creatureCatalog,
  availableNotes,
  isExpanded,
  onToggle,
}: EncounterRowProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(encounter.name);
  const [renameError, setRenameError] = useState<string | undefined>();
  const [isAddingNpc, setIsAddingNpc] = useState(false);
  const [isAddingNote, setIsAddingNote] = useState(false);

  async function submitRename() {
    const result = await renameEncounter(
      encounter.id,
      campaignId,
      sessionId,
      nameDraft,
    );
    if (result?.error) {
      setRenameError(result.error);
      return;
    }
    setRenameError(undefined);
    setIsRenaming(false);
  }

  return (
    <Row>
      <SummaryBar>
        <NameGroup>
          {isRenaming ? (
            <Input
              type="text"
              aria-label="Encounter name"
              value={nameDraft}
              autoFocus
              onChange={(event) => setNameDraft(event.target.value)}
              onBlur={submitRename}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  submitRename();
                }
                if (event.key === "Escape") {
                  setNameDraft(encounter.name);
                  setIsRenaming(false);
                }
              }}
            />
          ) : (
            <NameButton type="button" onClick={() => setIsRenaming(true)}>
              {encounter.name}
            </NameButton>
          )}
          <Meta>
            {encounter.npcs.length} NPCs • {encounter.notes.length} notes
          </Meta>
        </NameGroup>
        <Actions>
          <Button type="button" onClick={onToggle}>
            {isExpanded ? "Collapse" : "Expand"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              if (
                window.confirm("Delete this encounter? This cannot be undone.")
              ) {
                startTransition(() => {
                  deleteEncounter(encounter.id, campaignId, sessionId);
                });
              }
            }}
          >
            Delete
          </Button>
        </Actions>
      </SummaryBar>
      {renameError && <Meta>{renameError}</Meta>}
      {isExpanded && (
        <ExpandedPanel>
          <RoundCounter />
          <div>
            <Toolbar>
              <SectionHeading>NPCs</SectionHeading>
              <Button type="button" onClick={() => setIsAddingNpc(true)}>
                + Add NPC
              </Button>
            </Toolbar>
            <NpcTabs
              encounterNpcs={encounter.npcs}
              creatureCatalog={creatureCatalog}
              campaignId={campaignId}
              sessionId={sessionId}
            />
          </div>
          <div>
            <Toolbar>
              <SectionHeading>Notes</SectionHeading>
              <Button type="button" onClick={() => setIsAddingNote(true)}>
                + Add Note
              </Button>
            </Toolbar>
            <NotesList>
              {encounter.notes.length === 0 && <Meta>No notes attached.</Meta>}
              {encounter.notes.map((encounterNote) => (
                <NoteItem key={encounterNote.id}>
                  <div>
                    <strong>{encounterNote.note.title}</strong>
                    <p>{encounterNote.note.content}</p>
                  </div>
                  <Button
                    type="button"
                    onClick={() => {
                      startTransition(() => {
                        detachNoteFromEncounter(
                          encounterNote.id,
                          campaignId,
                          sessionId,
                        );
                      });
                    }}
                  >
                    Detach
                  </Button>
                </NoteItem>
              ))}
            </NotesList>
          </div>
          <Toolbar>
            <SectionHeading>Rules</SectionHeading>
            <Button type="button" disabled title="Coming soon">
              + Add Rule
            </Button>
          </Toolbar>
        </ExpandedPanel>
      )}
      {isAddingNpc && (
        <AddNpcModal
          encounterId={encounter.id}
          campaignId={campaignId}
          sessionId={sessionId}
          creatureCatalog={creatureCatalog}
          onClose={() => setIsAddingNpc(false)}
        />
      )}
      {isAddingNote && (
        <AttachNoteModal
          encounterId={encounter.id}
          campaignId={campaignId}
          sessionId={sessionId}
          availableNotes={availableNotes}
          onClose={() => setIsAddingNote(false)}
        />
      )}
    </Row>
  );
}
