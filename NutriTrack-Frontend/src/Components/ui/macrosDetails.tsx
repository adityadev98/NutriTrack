interface MacroDetailsProps {
    food: {
        protein: number;
        carbohydrates: number;
        fat: number;
        fiber: number;
    };
}

const MacroDetails: React.FC<MacroDetailsProps> = ({ food }) => {
    return (
        <>
            <div className="nutrient">
                <p className="n-title">Protein</p>
                <p className="n-value">{food.protein}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Carbs</p>
                <p className="n-value">{food.carbohydrates}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Fat</p>
                <p className="n-value">{food.fat}g</p>
            </div>
            <div className="nutrient">
                <p className="n-title">Fibre</p>
                <p className="n-value">{food.fiber}g</p>
            </div>
        </>
    );
};

export default MacroDetails;
