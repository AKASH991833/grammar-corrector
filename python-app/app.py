"""GrammarPro - neural grammar correction (Gradio).
Run: python app.py  (or: gradio app.py)
Model: prithivida/grammar_error_correcter_v1 (T5 fine-tuned for GEC), runs on CPU.
"""
import os
import torch
import gradio as gr
from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

MODEL = "prithivida/grammar_error_correcter_v1"
tok = AutoTokenizer.from_pretrained(MODEL)
model = AutoModelForSeq2SeqLM.from_pretrained(MODEL)
model.eval()

def correct(text):
    if not text.strip():
        return "", "Type or paste a sentence first."
    fixes, notes = [], []
    for sent in [s.strip() for s in text.replace("?", ".").replace("!", ".").split(".") if s.strip()]:
        inp = tok("gec: " + sent, return_tensors="pt", truncation=True, max_length=128)
        with torch.no_grad():
            out = model.generate(**inp, max_length=128, num_beams=4, early_stopping=True)
        fixed = tok.decode(out[0], skip_special_tokens=True).strip()
        if fixed and fixed[0].islower():
            fixed = fixed[0].upper() + fixed[1:]
        fixes.append(fixed.rstrip("."))
        if fixed.lower() != sent.lower():
            notes.append(f"**{sent.strip()}**  →  {fixed}")
    corrected = ". ".join(fixes) + ("." if fixes else "")
    if not notes:
        return corrected, "No errors found - your grammar looks clean. ✅"
    return corrected, "### What changed\n" + "\n".join(f"- {n}" for n in notes)

EXAMPLES = [
    ["She go to school everyday and plays football."],
    ["Their going to the market tommorow for buy vegetables."],
    ["I have many works to finish, and she don't help much."],
    ["He have been working here since five years."],
    ["Me and my friend was late to the class yesterday."],
]

demo = gr.Interface(
    fn=correct,
    inputs=gr.Textbox(lines=4, label="Your text", placeholder="Type a sentence with a mistake..."),
    outputs=[gr.Textbox(lines=4, label="Corrected"),
             gr.Markdown(label="Explanation")],
    title="✍️ GrammarPro",
    description="Neural grammar correction on CPU - a T5 model fine-tuned for grammatical "
                "error correction. **Honest limits:** it fixes grammar, not style; very long "
                "texts are split at sentence boundaries; it can occasionally over-correct "
                "informal-but-fine phrasing.",
    examples=EXAMPLES,
    flagging_mode="never",
)
if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=int(os.environ.get("PORT", 7860)))
