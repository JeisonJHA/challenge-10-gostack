import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      api.get('foods').then(response => setFoods(response.data));
    }

    loadFoods();
  }, []);

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      const response = await api.post<IFoodPlate>('foods', {
        ...food,
        available: true,
      });

      setFoods(state => [...state, response.data]);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    await api
      .put<IFoodPlate>(`foods/${editingFood.id}`, {
        ...food,
        id: editingFood.id,
        available: editingFood.available,
      })
      .then(response => {
        const newFood = response.data;
        setFoods(state => {
          return state.map(f => {
            if (f.id === newFood.id) return newFood;
            return f;
          });
        });
      });
  }

  async function handleUpdateAvailable(
    food: IFoodPlate,
    available: boolean,
  ): Promise<void> {
    await api.put(`foods/${food.id}`, { ...food, available });
  }

  async function handleDeleteFood(id: number): Promise<void> {
    await api.delete(`foods/${id}`);
    setFoods(old => old.filter(food => food.id !== id));
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleUpdateAvailable={handleUpdateAvailable}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
